import { Strategy } from 'passport-local';
import { PrismaService } from '../../../prisma/prisma.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(usernameOrEmail: string, password: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string;
        identificationNumber: string;
        username: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
