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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        password: string;
        username: string;
        email: string;
        identificationNumber: string;
        role: import("@prisma/client").$Enums.Role;
        mustChangePassword: boolean;
    }>;
}
export {};
