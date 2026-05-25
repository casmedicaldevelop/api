import { PrismaService } from '../../prisma/prisma.service';
import { CreateStopMaxDto } from './dto/create-stop-max.dto';
import { UpdateStopMaxDto } from './dto/update-stop-max.dto';
import { ListStopMaxDto } from './dto/list-stop-max.dto';
export declare class StopMaxService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    getTemplate(): Buffer;
}
