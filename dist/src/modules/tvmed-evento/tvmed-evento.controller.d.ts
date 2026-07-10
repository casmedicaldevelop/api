import { StreamableFile } from '@nestjs/common';
import { TvMedEventoService } from './tvmed-evento.service';
import { CreateTvMedEventoDto } from './dto/create-tvmed-evento.dto';
import { UpdateTvMedEventoDto } from './dto/update-tvmed-evento.dto';
import { ListTvMedEventoDto } from './dto/list-tvmed-evento.dto';
import { ApplyUpdateDto, MissingTemplateDto } from './dto/update-massive-tvmed-evento.dto';
export declare class TvMedEventoController {
    private readonly service;
    constructor(service: TvMedEventoService);
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
    getTemplate(): StreamableFile;
    getUpdateTemplate(): StreamableFile;
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
    previewUpdate(file: Express.Multer.File): Promise<{
        directs: {
            row: number;
            cum: string;
            name: string;
            value: number;
            target: {
                id: number;
                name: string;
                value: number;
            };
        }[];
        conflicts: {
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
        }[];
        missing: {
            cum: string;
            name: string;
            value: number;
        }[];
        errors: {
            row: number;
            column: string;
            reason: string;
        }[];
    }>;
    applyUpdate(dto: ApplyUpdateDto): Promise<{
        updated: number;
    }>;
    missingTemplate(dto: MissingTemplateDto): StreamableFile;
}
