import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: {
        user: any;
    }, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            mustChangePassword: boolean;
        };
    }>;
    refresh(req: {
        cookies: Record<string, string>;
    }, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    me(req: {
        user: {
            sub: string;
        };
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        mustChangePassword: boolean;
        modules: {
            name: string;
            label: string;
            icon: string;
        }[];
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        valid: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(req: {
        user: {
            sub: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        accessToken: string;
    }>;
}
