import { Role } from '@prisma/client';
export declare class ListStaffDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
}
