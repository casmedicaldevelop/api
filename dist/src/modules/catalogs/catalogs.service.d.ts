import { PrismaService } from '../../prisma/prisma.service';
export declare class CatalogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMeasurementUnits(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        code: number;
    }[]>;
    listPharmaceuticalForms(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        code: string;
    }[]>;
    listScientificUnits(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        description: string;
        code: number;
    }[]>;
}
