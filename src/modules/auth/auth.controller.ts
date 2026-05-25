import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AllowMustChangePassword } from './decorators/allow-must-change-password.decorator';
import { Public } from './decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(req.user);
    res.cookie('cas_refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Request() req: { cookies: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: string | undefined = req.cookies['cas_refresh_token'];
    if (!token) throw new UnauthorizedException('no refresh token');

    const result = await this.authService.refresh(token);
    res.cookie('cas_refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: result.accessToken };
  }

  @AllowMustChangePassword()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('cas_refresh_token', { httpOnly: true, sameSite: 'lax' });
    return this.authService.logout();
  }

  @AllowMustChangePassword()
  @Get('me')
  me(@Request() req: { user: { sub: string } }) {
    return this.authService.me(req.user.sub);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @AllowMustChangePassword()
  @Post('change-password')
  changePassword(
    @Request() req: { user: { sub: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
