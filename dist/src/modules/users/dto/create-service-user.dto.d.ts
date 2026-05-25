import { HealthcareRegime } from '@prisma/client';
export declare class CreateServiceUserDto {
    id: string;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    phone: string;
    email?: string;
    birthDate?: string;
    birthDateApproximate?: boolean;
    healthcareRegime?: HealthcareRegime;
    city?: string;
    neighborhood?: string;
    address?: string;
    description?: string;
}
