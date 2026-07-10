import { DocumentType, Gender, HealthcareRegime } from '@prisma/client';
export declare class UpdateServiceUserDto {
    documentType?: DocumentType;
    gender?: Gender;
    firstName?: string;
    secondName?: string | null;
    firstSurname?: string;
    secondSurname?: string | null;
    phone?: string;
    email?: string;
    birthDate?: string;
    birthDateApproximate?: boolean;
    healthcareRegime?: HealthcareRegime;
    department?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    description?: string;
    isActive?: boolean;
}
