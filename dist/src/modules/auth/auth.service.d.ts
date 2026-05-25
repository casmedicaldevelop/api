import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Employee } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    private _resend;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    private get resend();
    private sha256;
    private generateAccessToken;
    private generateRefreshToken;
    login(employee: Employee): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            mustChangePassword: boolean;
        };
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    me(userId: string): Promise<{
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
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        valid: boolean;
    }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        accessToken: string;
    }>;
}
