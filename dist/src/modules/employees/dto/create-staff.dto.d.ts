import { Role } from '@prisma/client';
export declare class CreateStaffDto {
    name: string;
    email: string;
    username: string;
    identificationNumber: string;
    phone?: string;
    role?: Role;
    moduleIds?: string[];
}
