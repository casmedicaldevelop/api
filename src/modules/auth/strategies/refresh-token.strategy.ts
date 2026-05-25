import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['refresh_token'] ?? null,
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: {
      sub: string;
      name: string;
      email: string;
      role: string;
      mustChangePassword: boolean;
    },
  ) {
    return {
      ...payload,
      rawRefreshToken: req.cookies['refresh_token'] as string,
    };
  }
}
