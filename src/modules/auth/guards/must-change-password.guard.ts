import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ALLOW_MCP_KEY } from '../decorators/allow-must-change-password.decorator';

@Injectable()
export class MustChangePasswordGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as
      | { mustChangePassword?: boolean }
      | undefined;

    if (!user) return true;

    const isAllowed = this.reflector.getAllAndOverride<boolean>(ALLOW_MCP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAllowed) return true;

    if (user.mustChangePassword === true) {
      throw new ForbiddenException({ code: 'MUST_CHANGE_PASSWORD' });
    }

    return true;
  }
}
