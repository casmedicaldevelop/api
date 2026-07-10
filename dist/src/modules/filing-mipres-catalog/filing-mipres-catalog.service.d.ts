import { PrismaService } from '../../prisma/prisma.service';
export declare class FilingMipresCatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listStatuses(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        displayOrder: number;
        code: string;
    }[]>;
    listSubstatuses(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        displayOrder: number;
        code: string;
        parentStatusCode: string;
    }[]>;
}
