import { CatalogsService } from './catalogs.service';
export declare class CatalogsController {
    private readonly catalogsService;
    constructor(catalogsService: CatalogsService);
    measurementUnits(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        code: number;
    }[]>;
    pharmaceuticalForms(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        code: string;
    }[]>;
    scientificUnits(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        description: string;
        code: number;
    }[]>;
}
