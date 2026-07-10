import { PrismaService } from '../../prisma/prisma.service';
export declare class DiagnosesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(search?: string, limit?: number): Promise<{
        description: string;
        code: string;
    }[]>;
}
