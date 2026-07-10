import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { Employee } from '@prisma/client';

type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
};

type RefreshPayload = { sub: string };

@Injectable()
export class AuthService {
  private _resend: Resend | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get resend(): Resend {
    if (!this._resend) {
      const apiKey = this.config.getOrThrow<string>('RESEND_API_KEY');
      this._resend = new Resend(apiKey);
    }
    return this._resend;
  }

  // ─── Utilities ───────────────────────────────────────────────────────────

  private sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  private generateAccessToken(employee: Employee): string {
    const payload: JwtPayload = {
      sub: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      mustChangePassword: employee.mustChangePassword,
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(employee: Employee): string {
    const payload: RefreshPayload = { sub: employee.id };
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES', '7d');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: expiresIn as any,
    });
  }

  // ─── Login / Logout ───────────────────────────────────────────────────────

  async login(employee: Employee) {
    const accessToken = this.generateAccessToken(employee);
    const refreshToken = this.generateRefreshToken(employee);
    return {
      accessToken,
      refreshToken,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        mustChangePassword: employee.mustChangePassword,
      },
    };
  }

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: RefreshPayload;
    try {
      payload = this.jwtService.verify<RefreshPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new BadRequestException('invalid refresh token');
    }

    const employee = await this.prisma.employee.findUnique({ where: { id: payload.sub } });
    if (!employee) throw new BadRequestException('invalid refresh token');

    return {
      accessToken: this.generateAccessToken(employee),
      refreshToken: this.generateRefreshToken(employee),
    };
  }

  async logout() {
    return { message: 'Logged out' };
  }

  // ─── Me ──────────────────────────────────────────────────────────────────

  async me(userId: string) {
    const employee = await this.prisma.employee.findUniqueOrThrow({
      where: { id: userId },
      include: {
        modules: {
          where: { module: { isActive: true } },
          orderBy: { module: { displayOrder: 'asc' } },
          include: { module: true },
        },
      },
    });

    let modules: Array<{ name: string; label: string; icon: string }>;

    if (employee.role === 'ADMINISTRADOR') {
      const allModules = await this.prisma.module.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      modules = allModules.map((m) => ({ name: m.name, label: m.label, icon: m.icon }));
    } else {
      modules = employee.modules.map((um) => ({
        name: um.module.name,
        label: um.module.label,
        icon: um.module.icon,
      }));
    }

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      mustChangePassword: employee.mustChangePassword,
      modules,
    };
  }

  // ─── Forgot / Reset password ──────────────────────────────────────────────

  async forgotPassword(email: string) {
    console.log(`[OTP] forgotPassword → email=${email}`);

    const employee = await this.prisma.employee.findUnique({ where: { email } });
    console.log(`[OTP] employee lookup → found=${!!employee}`);

    if (employee) {
      const otp = randomInt(100000, 999999).toString();
      const otpHash = this.sha256(otp);
      const ttlMinutes = parseInt(this.config.get('OTP_TTL_MINUTES', '15'), 10);

      const newOtpRecord = await this.prisma.passwordResetOtp.create({
        data: {
          employeeId: employee.id,
          otpHash,
          expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
        },
      });
      console.log(`[OTP] otp record created → id=${newOtpRecord.id} expiresAt=${newOtpRecord.expiresAt.toISOString()}`);

      const from = this.config.get<string>('RESEND_FROM', 'onboarding@resend.dev');
      console.log(`[OTP] resend.send → from=${from} to=${email}`);

      try {
        const result = await this.resend.emails.send({
          from,
          to: email,
          subject: 'Código de verificación CASMEDICAL',
          html: `<p>Tu código de verificación es: <strong>${otp}</strong></p><p>Expira en ${ttlMinutes} minutos.</p>`,
        });
        console.log(`[OTP] resend.result → data=${JSON.stringify(result.data)} error=${JSON.stringify(result.error)}`);
      } catch (err) {
        console.error(`[OTP] resend.exception → to=${email} error=${JSON.stringify(err)}`);
        return { message: 'If the email exists, a code was sent' };
      }

      await this.prisma.passwordResetOtp.deleteMany({
        where: { employeeId: employee.id, used: false, id: { not: newOtpRecord.id } },
      });
    }

    return { message: 'If the email exists, a code was sent' };
  }

  async verifyOtp(email: string, otp: string): Promise<{ valid: boolean }> {
    console.log(`[OTP] verifyOtp → email=${email}`);

    const employee = await this.prisma.employee.findUnique({ where: { email } });
    console.log(`[OTP] verifyOtp employee lookup → found=${!!employee}`);
    if (!employee) throw new BadRequestException('invalid OTP');

    const otpRecord = await this.prisma.passwordResetOtp.findFirst({
      where: {
        employeeId: employee.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[OTP] verifyOtp otp record → found=${!!otpRecord} attempts=${otpRecord?.attempts ?? 'n/a'}`);
    if (!otpRecord) throw new BadRequestException('invalid OTP');
    if (otpRecord.attempts >= 3) throw new BadRequestException('max attempts reached');

    let atomicRecord: { id: string; otpHash: string } | null = null;
    try {
      atomicRecord = await this.prisma.passwordResetOtp.update({
        where: {
          id: otpRecord.id,
          attempts: { lt: 3 },
          used: false,
          expiresAt: { gt: new Date() },
        },
        data: { attempts: { increment: 1 } },
        select: { id: true, otpHash: true },
      });
      console.log(`[OTP] verifyOtp atomic update → success=true id=${atomicRecord.id}`);
    } catch (err) {
      console.error(`[OTP] verifyOtp atomic update → success=false error=${JSON.stringify(err)}`);
      throw new BadRequestException('max attempts reached');
    }

    const incomingHash = this.sha256(otp);
    const storedHash = atomicRecord!.otpHash;

    if (storedHash.length !== 64 || incomingHash.length !== 64) {
      console.log(`[OTP] verifyOtp hash validation → invalid length stored=${storedHash.length} incoming=${incomingHash.length}`);
      throw new BadRequestException('invalid OTP');
    }

    const match = timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(incomingHash, 'hex'),
    );
    console.log(`[OTP] verifyOtp hash match → result=${match} storedPrefix=${storedHash.slice(0, 6)}... incomingPrefix=${incomingHash.slice(0, 6)}...`);

    if (!match) throw new BadRequestException('invalid OTP');

    return { valid: true };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    console.log(`[OTP] resetPassword → email=${email}`);

    const employee = await this.prisma.employee.findUnique({ where: { email } });
    console.log(`[OTP] employee lookup → found=${!!employee}`);
    if (!employee) throw new BadRequestException('invalid OTP');

    const otpRecord = await this.prisma.passwordResetOtp.findFirst({
      where: {
        employeeId: employee.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[OTP] otp record → found=${!!otpRecord} attempts=${otpRecord?.attempts ?? 'n/a'} expired=${!otpRecord}`);
    if (!otpRecord) throw new BadRequestException('invalid OTP');
    if (otpRecord.attempts >= 3) throw new BadRequestException('max attempts reached');

    let atomicRecord: { id: string; otpHash: string } | null = null;
    try {
      atomicRecord = await this.prisma.passwordResetOtp.update({
        where: {
          id: otpRecord.id,
          attempts: { lt: 3 },
          used: false,
          expiresAt: { gt: new Date() },
        },
        data: { attempts: { increment: 1 } },
        select: { id: true, otpHash: true },
      });
      console.log(`[OTP] atomic update → success=true id=${atomicRecord.id}`);
    } catch (err) {
      console.error(`[OTP] atomic update → success=false error=${JSON.stringify(err)}`);
      throw new BadRequestException('max attempts reached');
    }

    const incomingHash = this.sha256(otp);
    const storedHash = atomicRecord!.otpHash;

    if (storedHash.length !== 64 || incomingHash.length !== 64) {
      console.log(`[OTP] hash validation → invalid hash length stored=${storedHash.length} incoming=${incomingHash.length}`);
      throw new BadRequestException('invalid OTP');
    }

    const match = timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(incomingHash, 'hex'),
    );
    console.log(`[OTP] hash match → result=${match} storedPrefix=${storedHash.slice(0, 6)}... incomingPrefix=${incomingHash.slice(0, 6)}...`);

    if (!match) throw new BadRequestException('invalid OTP');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.employee.update({
        where: { id: employee.id },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetOtp.update({
        where: { id: atomicRecord!.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password updated' };
  }

  // ─── Change password ──────────────────────────────────────────────────────

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const employee = await this.prisma.employee.findUniqueOrThrow({ where: { id: userId } });

    const match = await bcrypt.compare(currentPassword, employee.password);
    if (!match) throw new BadRequestException('current password incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.employee.update({
      where: { id: userId },
      data: { password: hashedPassword, mustChangePassword: false },
    });

    const updatedEmployee = await this.prisma.employee.findUniqueOrThrow({ where: { id: userId } });
    const accessToken = this.generateAccessToken(updatedEmployee);

    return { accessToken };
  }

}
