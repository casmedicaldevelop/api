import { StreamableFile } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ListProviderProductsDto } from './dto/list-provider-products.dto';
import { UpdateProviderProductDto } from './dto/update-provider-product.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
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
    getTemplate(id: number): Promise<StreamableFile>;
    findProducts(id: number, dto: ListProviderProductsDto): Promise<{
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
    findProduct(id: number, code: string): Promise<{
        code: string;
        product: string;
        iva: boolean;
        cum: string | null;
        priceBox: number;
        priceUnit: number;
        stopBox: number;
    }>;
    updateProduct(id: number, code: string, dto: UpdateProviderProductDto): Promise<{
        code: string;
        product: string;
        iva: boolean;
        cum: string | null;
        priceBox: number;
        priceUnit: number;
        stopBox: number;
    }>;
    bulkUpload(id: number, file: Express.Multer.File, mode: string): Promise<{
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
}
