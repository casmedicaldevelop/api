import { DocumentType, Gender, HealthcareRegime } from '@prisma/client';
export declare class CreateServiceUserDto {
    id: string;
    documentType?: DocumentType;
    gender?: Gender;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    phone: string;
    email?: string;
    birthDate?: string;
    birthDateApproximate?: boolean;
    healthcareRegime?: HealthcareRegime;
    department?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    description?: string;
}
