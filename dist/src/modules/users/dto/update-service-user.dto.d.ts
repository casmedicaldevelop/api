import { HealthcareRegime } from '@prisma/client';
export declare class UpdateServiceUserDto {
    firstName?: string;
    secondName?: string | null;
    firstSurname?: string;
    secondSurname?: string | null;
    phone?: string;
    email?: string;
    birthDate?: string;
    birthDateApproximate?: boolean;
    healthcareRegime?: HealthcareRegime;
    city?: string;
    neighborhood?: string;
    address?: string;
    description?: string;
    isActive?: boolean;
}
