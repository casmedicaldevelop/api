import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ListProviderProductsDto } from './dto/list-provider-products.dto';
import { UpdateProviderProductDto } from './dto/update-provider-product.dto';
export declare class ProvidersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getDelegate;
    findAll(): Promise<{
        id: number;
        name: string;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        tableKey: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        tableKey: string;
    }>;
    update(id: number, dto: UpdateProviderDto): Promise<{
        id: number;
        name: string;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        tableKey: string;
    }>;
    findProducts(providerId: number, dto: ListProviderProductsDto): Promise<{
        data: {
            code: string;
            product: string;
            iva: boolean;
            cum: string | null;
            priceBox: number;
            priceUnit: number;
            stopBox: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findProduct(providerId: number, code: string): Promise<{
        code: string;
        product: string;
        iva: boolean;
        cum: string | null;
        priceBox: number;
        priceUnit: number;
        stopBox: number;
    }>;
    updateProduct(providerId: number, code: string, dto: UpdateProviderProductDto): Promise<{
        code: string;
        product: string;
        iva: boolean;
        cum: string | null;
        priceBox: number;
        priceUnit: number;
        stopBox: number;
    }>;
    bulkUpload(providerId: number, file: Express.Multer.File, mode: 'upload' | 'update'): Promise<{
        inserted: number;
        skipped: number;
        updated: number;
        total: number;
        mode: "upload";
    } | {
        inserted: number;
        updated: number;
        total: number;
        mode: "update";
        skipped?: undefined;
    }>;
    getTemplate(providerName: string): Buffer;
}
