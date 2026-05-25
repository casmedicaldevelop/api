import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: {
    sub: string;
    name: string;
    email: string;
    role: string;
    mustChangePassword: boolean;
  }) {
    return {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      mustChangePassword: payload.mustChangePassword,
    };
  }
}
