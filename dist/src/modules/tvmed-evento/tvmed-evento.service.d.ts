import { PrismaService } from '../../prisma/prisma.service';
import { CreateTvMedEventoDto } from './dto/create-tvmed-evento.dto';
import { UpdateTvMedEventoDto } from './dto/update-tvmed-evento.dto';
import { ListTvMedEventoDto } from './dto/list-tvmed-evento.dto';
type UpdateRowError = {
    row: number;
    column: string;
    reason: string;
};
type DirectUpdate = {
    row: number;
    cum: string;
    name: string;
    value: number;
    target: {
        id: number;
        name: string;
        value: number;
    };
};
type ConflictUpdate = {
    row: number;
    cum: string;
    name: string;
    value: number;
    candidates: {
        id: number;
        name: string;
        value: number;
        concentration: string;
        presentation: string;
        shortName: string;
    }[];
};
type MissingUpdate = {
    cum: string;
    name: string;
    value: number;
};
export declare class TvMedEventoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(dto: ListTvMedEventoDto): Promise<{
        data: ({
            measurementUnitRef: {
                name: string;
                description: string;
                code: number;
            };
            dispensingUnitRef: {
                description: string;
                code: number;
            };
            pharmaceuticalFormRef: {
                description: string;
                code: string;
            };
        } & {
            id: number;
            name: string;
            isActive: boolean;
            createdAt: Date;
            measurementUnit: number;
            pharmaceuticalForm: string;
            value: number;
            cum: string;
            concentration: string;
            presentation: string;
            administrationRoute: string;
            shortName: string;
            dispensingUnit: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        measurementUnitRef: {
            name: string;
            description: string;
            code: number;
        };
        dispensingUnitRef: {
            description: string;
            code: number;
        };
        pharmaceuticalFormRef: {
            description: string;
            code: string;
        };
    } & {
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        measurementUnit: number;
        pharmaceuticalForm: string;
        value: number;
        cum: string;
        concentration: string;
        presentation: string;
        administrationRoute: string;
        shortName: string;
        dispensingUnit: number;
    }>;
    findByCum(cum: string): Promise<({
        measurementUnitRef: {
            name: string;
            description: string;
            code: number;
        };
        dispensingUnitRef: {
            description: string;
            code: number;
        };
        pharmaceuticalFormRef: {
            description: string;
            code: string;
        };
    } & {
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        measurementUnit: number;
        pharmaceuticalForm: string;
        value: number;
        cum: string;
        concentration: string;
        presentation: string;
        administrationRoute: string;
        shortName: string;
        dispensingUnit: number;
    })[]>;
    private assertRefs;
    create(dto: CreateTvMedEventoDto): Promise<{
        measurementUnitRef: {
            name: string;
            description: string;
            code: number;
        };
        dispensingUnitRef: {
            description: string;
            code: number;
        };
        pharmaceuticalFormRef: {
            description: string;
            code: string;
        };
    } & {
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        measurementUnit: number;
        pharmaceuticalForm: string;
        value: number;
        cum: string;
        concentration: string;
        presentation: string;
        administrationRoute: string;
        shortName: string;
        dispensingUnit: number;
    }>;
    update(id: number, dto: UpdateTvMedEventoDto): Promise<{
        measurementUnitRef: {
            name: string;
            description: string;
            code: number;
        };
        dispensingUnitRef: {
            description: string;
            code: number;
        };
        pharmaceuticalFormRef: {
            description: string;
            code: string;
        };
    } & {
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        measurementUnit: number;
        pharmaceuticalForm: string;
        value: number;
        cum: string;
        concentration: string;
        presentation: string;
        administrationRoute: string;
        shortName: string;
        dispensingUnit: number;
    }>;
    remove(id: number): Promise<void>;
    bulkUpload(file: Express.Multer.File): Promise<{
        inserted: number;
        total: number;
    }>;
    getTemplate(): Buffer;
    getUpdateTemplate(): Buffer;
    private readSheet;
    previewUpdate(file: Express.Multer.File): Promise<{
        directs: DirectUpdate[];
        conflicts: ConflictUpdate[];
        missing: MissingUpdate[];
        errors: UpdateRowError[];
    }>;
    applyUpdate(items: {
        id: number;
        value: number;
    }[]): Promise<{
        updated: number;
    }>;
    getMissingTemplate(rows: {
        cum: string;
        name: string;
        value: number;
    }[]): Buffer;
}
export {};
