import { PrismaService } from '../../prisma/prisma.service';
import { UpsertCompanyDto } from './dto/upsert-company.dto';
import { UpdateMipresDto } from './dto/update-mipres.dto';
export declare class CompanyService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getCompany(): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        nit: string;
        tokenCompany: string | null;
        codeProvider: string | null;
        tokenAuth: string | null;
    }>;
    upsertCompany(dto: UpsertCompanyDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        nit: string;
        tokenCompany: string | null;
        codeProvider: string | null;
        tokenAuth: string | null;
    }>;
    updateMipres(dto: UpdateMipresDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        nit: string;
        tokenCompany: string | null;
        codeProvider: string | null;
        tokenAuth: string | null;
    }>;
    generateMipresToken(): Promise<string>;
}
