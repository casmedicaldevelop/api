import { Role } from '@prisma/client';
export declare class UpdateStaffDto {
    name?: string;
    email?: string;
    username?: string;
    identificationNumber?: string;
    phone?: string | null;
    role?: Role;
    isActive?: boolean;
}
