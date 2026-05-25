import { PrismaService } from '../../prisma/prisma.service';
import { CreateTvMedDto } from './dto/create-tv-med.dto';
import { UpdateTvMedDto } from './dto/update-tv-med.dto';
import { ListTvMedDto } from './dto/list-tv-med.dto';
export declare class TvMedService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(dto: ListTvMedDto): Promise<{
        data: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
    }>;
    create(dto: CreateTvMedDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
    }>;
    update(id: number, dto: UpdateTvMedDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        code: string;
    }>;
    remove(id: number): Promise<void>;
    bulkUpload(file: Express.Multer.File): Promise<{
        inserted: number;
        total: number;
    }>;
    getTemplate(): Buffer;
}
