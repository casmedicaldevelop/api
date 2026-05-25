"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const resend_1 = require("resend");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    _resend = null;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    get resend() {
        if (!this._resend) {
            const apiKey = this.config.getOrThrow('RESEND_API_KEY');
            this._resend = new resend_1.Resend(apiKey);
        }
        return this._resend;
    }
    sha256(data) {
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    generateAccessToken(employee) {
        const payload = {
            sub: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            mustChangePassword: employee.mustChangePassword,
        };
        return this.jwtService.sign(payload);
    }
    generateRefreshToken(employee) {
        const payload = { sub: employee.id };
        const expiresIn = this.config.get('JWT_REFRESH_EXPIRES', '7d');
        return this.jwtService.sign(payload, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: expiresIn,
        });
    }
    async login(employee) {
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
    async refresh(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.BadRequestException('invalid refresh token');
        }
        const employee = await this.prisma.employee.findUnique({ where: { id: payload.sub } });
        if (!employee)
            throw new common_1.BadRequestException('invalid refresh token');
        return {
            accessToken: this.generateAccessToken(employee),
            refreshToken: this.generateRefreshToken(employee),
        };
    }
    async logout() {
        return { message: 'Logged out' };
    }
    async me(userId) {
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
        let modules;
        if (employee.role === 'ADMIN') {
            const allModules = await this.prisma.module.findMany({
                orderBy: { displayOrder: 'asc' },
            });
            modules = allModules.map((m) => ({ name: m.name, label: m.label, icon: m.icon }));
        }
        else {
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
    async forgotPassword(email) {
        console.log(`[OTP] forgotPassword → email=${email}`);
        const employee = await this.prisma.employee.findUnique({ where: { email } });
        console.log(`[OTP] employee lookup → found=${!!employee}`);
        if (employee) {
            const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
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
            const from = this.config.get('RESEND_FROM', 'onboarding@resend.dev');
            console.log(`[OTP] resend.send → from=${from} to=${email}`);
            try {
                const result = await this.resend.emails.send({
                    from,
                    to: email,
                    subject: 'Código de verificación CASMEDICAL',
                    html: `<p>Tu código de verificación es: <strong>${otp}</strong></p><p>Expira en ${ttlMinutes} minutos.</p>`,
                });
                console.log(`[OTP] resend.result → data=${JSON.stringify(result.data)} error=${JSON.stringify(result.error)}`);
            }
            catch (err) {
                console.error(`[OTP] resend.exception → to=${email} error=${JSON.stringify(err)}`);
                return { message: 'If the email exists, a code was sent' };
            }
            await this.prisma.passwordResetOtp.deleteMany({
                where: { employeeId: employee.id, used: false, id: { not: newOtpRecord.id } },
            });
        }
        return { message: 'If the email exists, a code was sent' };
    }
    async verifyOtp(email, otp) {
        console.log(`[OTP] verifyOtp → email=${email}`);
        const employee = await this.prisma.employee.findUnique({ where: { email } });
        console.log(`[OTP] verifyOtp employee lookup → found=${!!employee}`);
        if (!employee)
            throw new common_1.BadRequestException('invalid OTP');
        const otpRecord = await this.prisma.passwordResetOtp.findFirst({
            where: {
                employeeId: employee.id,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`[OTP] verifyOtp otp record → found=${!!otpRecord} attempts=${otpRecord?.attempts ?? 'n/a'}`);
        if (!otpRecord)
            throw new common_1.BadRequestException('invalid OTP');
        if (otpRecord.attempts >= 3)
            throw new common_1.BadRequestException('max attempts reached');
        let atomicRecord = null;
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
        }
        catch (err) {
            console.error(`[OTP] verifyOtp atomic update → success=false error=${JSON.stringify(err)}`);
            throw new common_1.BadRequestException('max attempts reached');
        }
        const incomingHash = this.sha256(otp);
        const storedHash = atomicRecord.otpHash;
        if (storedHash.length !== 64 || incomingHash.length !== 64) {
            console.log(`[OTP] verifyOtp hash validation → invalid length stored=${storedHash.length} incoming=${incomingHash.length}`);
            throw new common_1.BadRequestException('invalid OTP');
        }
        const match = (0, crypto_1.timingSafeEqual)(Buffer.from(storedHash, 'hex'), Buffer.from(incomingHash, 'hex'));
        console.log(`[OTP] verifyOtp hash match → result=${match} storedPrefix=${storedHash.slice(0, 6)}... incomingPrefix=${incomingHash.slice(0, 6)}...`);
        if (!match)
            throw new common_1.BadRequestException('invalid OTP');
        return { valid: true };
    }
    async resetPassword(email, otp, newPassword) {
        console.log(`[OTP] resetPassword → email=${email}`);
        const employee = await this.prisma.employee.findUnique({ where: { email } });
        console.log(`[OTP] employee lookup → found=${!!employee}`);
        if (!employee)
            throw new common_1.BadRequestException('invalid OTP');
        const otpRecord = await this.prisma.passwordResetOtp.findFirst({
            where: {
                employeeId: employee.id,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`[OTP] otp record → found=${!!otpRecord} attempts=${otpRecord?.attempts ?? 'n/a'} expired=${!otpRecord}`);
        if (!otpRecord)
            throw new common_1.BadRequestException('invalid OTP');
        if (otpRecord.attempts >= 3)
            throw new common_1.BadRequestException('max attempts reached');
        let atomicRecord = null;
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
        }
        catch (err) {
            console.error(`[OTP] atomic update → success=false error=${JSON.stringify(err)}`);
            throw new common_1.BadRequestException('max attempts reached');
        }
        const incomingHash = this.sha256(otp);
        const storedHash = atomicRecord.otpHash;
        if (storedHash.length !== 64 || incomingHash.length !== 64) {
            console.log(`[OTP] hash validation → invalid hash length stored=${storedHash.length} incoming=${incomingHash.length}`);
            throw new common_1.BadRequestException('invalid OTP');
        }
        const match = (0, crypto_1.timingSafeEqual)(Buffer.from(storedHash, 'hex'), Buffer.from(incomingHash, 'hex'));
        console.log(`[OTP] hash match → result=${match} storedPrefix=${storedHash.slice(0, 6)}... incomingPrefix=${incomingHash.slice(0, 6)}...`);
        if (!match)
            throw new common_1.BadRequestException('invalid OTP');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.employee.update({
                where: { id: employee.id },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordResetOtp.update({
                where: { id: atomicRecord.id },
                data: { used: true },
            }),
        ]);
        return { message: 'Password updated' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const employee = await this.prisma.employee.findUniqueOrThrow({ where: { id: userId } });
        const match = await bcrypt.compare(currentPassword, employee.password);
        if (!match)
            throw new common_1.BadRequestException('current password incorrect');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.employee.update({
            where: { id: userId },
            data: { password: hashedPassword, mustChangePassword: false },
        });
        const updatedEmployee = await this.prisma.employee.findUniqueOrThrow({ where: { id: userId } });
        const accessToken = this.generateAccessToken(updatedEmployee);
        return { accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map