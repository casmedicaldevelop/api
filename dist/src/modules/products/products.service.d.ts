import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { AssignCumProvider1Dto } from './dto/assign-cum-provider1.dto';
import { SkipCumProvider1Dto } from './dto/skip-cum-provider1.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(dto: ListProductsDto): Promise<{
        data: {
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            product: string;
            code: string;
            cum: string | null;
            box: number;
            unit: number;
            lot: string;
            warehouse: number;
            cumSkipped: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        code: string;
        cum: string | null;
        box: number;
        unit: number;
        lot: string;
        warehouse: number;
        cumSkipped: boolean;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        code: string;
        cum: string | null;
        box: number;
        unit: number;
        lot: string;
        warehouse: number;
        cumSkipped: boolean;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        product: string;
        code: string;
        cum: string | null;
        box: number;
        unit: number;
        lot: string;
        warehouse: number;
        cumSkipped: boolean;
    }>;
    remove(id: number): Promise<void>;
    bulkUpload(file: Express.Multer.File): Promise<{
        inserted: number;
        skipped: number;
        total: number;
    }>;
    getCumPendingProvider1(): Promise<{
        total: number;
        next: null;
    } | {
        total: number;
        next: {
            code: string;
            product: string;
            affectedRows: number;
        };
    }>;
    getCumSuggestionsProvider1(q: string): Promise<{
        product: string;
        code: string;
        cum: string | null;
    }[]>;
    assignCumProvider1(dto: AssignCumProvider1Dto): Promise<{
        updated: number;
    }>;
    skipCumProvider1(dto: SkipCumProvider1Dto): Promise<{
        updated: number;
    }>;
    getTemplate(): Buffer;
}
