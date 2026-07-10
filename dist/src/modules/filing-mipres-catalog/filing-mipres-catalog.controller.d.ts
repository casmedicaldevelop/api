import { FilingMipresCatalogService } from './filing-mipres-catalog.service';
export declare class FilingMipresCatalogController {
    private readonly service;
    constructor(service: FilingMipresCatalogService);
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
