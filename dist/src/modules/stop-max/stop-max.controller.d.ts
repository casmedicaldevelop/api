import { StreamableFile } from '@nestjs/common';
import { StopMaxService } from './stop-max.service';
import { CreateStopMaxDto } from './dto/create-stop-max.dto';
import { UpdateStopMaxDto } from './dto/update-stop-max.dto';
import { ListStopMaxDto } from './dto/list-stop-max.dto';
export declare class StopMaxController {
    private readonly stopMaxService;
    constructor(stopMaxService: StopMaxService);
    findAll(dto: ListStopMaxDto): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            product: string;
            cum: string | null;
            price: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTemplate(): StreamableFile;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        cum: string | null;
        price: number;
    }>;
    create(dto: CreateStopMaxDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        cum: string | null;
        price: number;
    }>;
    update(id: number, dto: UpdateStopMaxDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        cum: string | null;
        price: number;
    }>;
    remove(id: number): Promise<void>;
    bulkUpload(file: Express.Multer.File): Promise<{
        inserted: number;
        total: number;
    }>;
}
