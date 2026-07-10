import { StreamableFile } from '@nestjs/common';
import { TvDataService } from './tv-data.service';
import { CreateTvDataDto } from './dto/create-tv-data.dto';
import { UpdateTvDataDto } from './dto/update-tv-data.dto';
import { ListTvDataDto } from './dto/list-tv-data.dto';
export declare class TvDataController {
    private readonly tvDataService;
    constructor(tvDataService: TvDataService);
    findAll(dto: ListTvDataDto): Promise<{
        data: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
            price: number;
            inventoryCode: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTemplate(): StreamableFile;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
        price: number;
        inventoryCode: string | null;
    }>;
    create(dto: CreateTvDataDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
        price: number;
        inventoryCode: string | null;
    }>;
    update(id: number, dto: UpdateTvDataDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
        price: number;
        inventoryCode: string | null;
    }>;
    remove(id: number): Promise<void>;
    bulkUpload(file: Express.Multer.File): Promise<{
        inserted: number;
        total: number;
    }>;
}
