import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly prisma: PrismaService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(usernameOrEmail: string, password: string) {
    if (!usernameOrEmail?.trim() || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isEmail = usernameOrEmail.includes('@');
    const user = await this.prisma.employee.findUnique({
      where: isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
