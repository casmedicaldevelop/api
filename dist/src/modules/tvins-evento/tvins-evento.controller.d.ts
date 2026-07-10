import { StreamableFile } from '@nestjs/common';
import { TvInsEventoService } from './tvins-evento.service';
import { CreateTvInsEventoDto } from './dto/create-tvins-evento.dto';
import { UpdateTvInsEventoDto } from './dto/update-tvins-evento.dto';
import { ListTvInsEventoDto } from './dto/list-tvins-evento.dto';
import { ApplyUpdateDto, MissingTemplateDto } from './dto/update-massive-tvins-evento.dto';
export declare class TvInsEventoController {
    private readonly service;
    constructor(service: TvInsEventoService);
    findAll(dto: ListTvInsEventoDto): Promise<{
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
    create(dto: CreateTvInsEventoDto): Promise<{
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
    update(id: number, dto: UpdateTvInsEventoDto): Promise<{
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
