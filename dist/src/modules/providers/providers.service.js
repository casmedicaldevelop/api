"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = __importStar(require("xlsx"));
const prisma_service_1 = require("../../prisma/prisma.service");
const normalize_cum_1 = require("../../common/utils/normalize-cum");
const COLUMN_ALIASES = {
    code: ['code', 'Code', 'CODE', 'codigo', 'CODIGO', 'Codigo'],
    product: ['product', 'Product', 'PRODUCT', 'producto', 'PRODUCTO', 'nombre', 'NOMBRE', 'Nombre'],
    iva: ['iva', 'IVA', 'Iva'],
    cum: ['cum', 'CUM', 'Cum'],
    priceBox: ['price_box', 'priceBox', 'PriceBox', 'precio_caja', 'PrecioCaja'],
    priceUnit: ['price_unit', 'priceUnit', 'PriceUnit', 'precio_unidad', 'PrecioUnidad'],
    stopBox: ['stop_box', 'stopBox', 'StopBox', 'paro_caja', 'ParoCaja'],
};
function resolveCol(row, field) {
    const aliases = COLUMN_ALIASES[field] ?? [field];
    for (const alias of aliases) {
        if (alias in row)
            return row[alias];
    }
    return undefined;
}
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDelegate(providerId) {
        const map = {
            1: this.prisma.provider1,
            2: this.prisma.provider2,
            3: this.prisma.provider3,
            4: this.prisma.provider4,
            5: this.prisma.provider5,
        };
        const delegate = map[providerId];
        if (!delegate)
            throw new common_1.NotFoundException(`Proveedor con ID ${providerId} no existe.`);
        return delegate;
    }
    async findAll() {
        return this.prisma.provider.findMany({ orderBy: { id: 'asc' } });
    }
    async findOne(id) {
        const provider = await this.prisma.provider.findUnique({ where: { id } });
        if (!provider)
            throw new common_1.NotFoundException(`Proveedor con ID ${id} no encontrado.`);
        return provider;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.provider.update({ where: { id }, data: dto });
    }
    async findProducts(providerId, dto) {
        await this.findOne(providerId);
        const delegate = this.getDelegate(providerId);
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (dto.search) {
            where.OR = [
                { code: { contains: dto.search, mode: 'insensitive' } },
                { product: { contains: dto.search, mode: 'insensitive' } },
                { cum: { contains: dto.search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            delegate.findMany({ where, skip, take: limit, orderBy: { code: 'asc' } }),
            delegate.count({ where: where.OR ? { OR: where.OR } : {} }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findProduct(providerId, code) {
        await this.findOne(providerId);
        const delegate = this.getDelegate(providerId);
        const product = await delegate.findUnique({ where: { code } });
        if (!product)
            throw new common_1.NotFoundException(`Producto '${code}' no encontrado en proveedor ${providerId}.`);
        return product;
    }
    async updateProduct(providerId, code, dto) {
        await this.findProduct(providerId, code);
        const delegate = this.getDelegate(providerId);
        return delegate.update({
            where: { code },
            data: { ...dto, ...(dto.cum !== undefined && { cum: (0, normalize_cum_1.normalizeCum)(dto.cum) }) },
        });
    }
    async bulkUpload(providerId, file, mode) {
        await this.findOne(providerId);
        const delegate = this.getDelegate(providerId);
        if (!file)
            throw new common_1.BadRequestException('No se proporcionó ningún archivo.');
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
            throw new common_1.BadRequestException('Solo se aceptan archivos .xlsx, .xls o .csv.');
        }
        let workbook;
        try {
            workbook = xlsx.read(file.buffer, { type: 'buffer' });
        }
        catch {
            throw new common_1.BadRequestException('El archivo no pudo ser leído. Verifique que sea un Excel o CSV válido.');
        }
        const sheetName = workbook.SheetNames[0];
        if (!sheetName)
            throw new common_1.BadRequestException('El archivo no contiene ninguna hoja de datos.');
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
        if (rows.length === 0)
            throw new common_1.BadRequestException('El archivo está vacío.');
        const products = rows.map((row, i) => {
            const code = String(resolveCol(row, 'code') ?? '').trim();
            const product = String(resolveCol(row, 'product') ?? '').trim();
            if (!code)
                throw new common_1.BadRequestException(`Fila ${i + 2}: el campo 'code' es requerido.`);
            if (!product)
                throw new common_1.BadRequestException(`Fila ${i + 2}: el campo 'product' es requerido.`);
            const ivaRaw = resolveCol(row, 'iva');
            const cumRaw = resolveCol(row, 'cum');
            let iva = false;
            if (ivaRaw !== undefined && ivaRaw !== null && String(ivaRaw).trim() !== '') {
                const ivaStr = String(ivaRaw).trim();
                if (ivaStr === 'SI')
                    iva = true;
                else if (ivaStr === 'NO')
                    iva = false;
                else
                    throw new common_1.BadRequestException(`Fila ${i + 2}: el campo 'iva' debe ser 'SI' o 'NO' en mayúsculas.`);
            }
            const cum = (0, normalize_cum_1.normalizeCum)(cumRaw !== undefined && cumRaw !== null ? String(cumRaw) : null);
            const priceBox = Math.max(0, parseFloat(String(resolveCol(row, 'priceBox') ?? '0')) || 0);
            const priceUnit = Math.max(0, parseFloat(String(resolveCol(row, 'priceUnit') ?? '0')) || 0);
            const stopBox = Math.max(0, parseFloat(String(resolveCol(row, 'stopBox') ?? '0')) || 0);
            return { code, product, iva, cum, priceBox, priceUnit, stopBox };
        });
        if (mode === 'upload') {
            const seenInFile = new Set();
            const uniqueProducts = products.filter((p) => {
                const key = p.code.toLowerCase();
                if (seenInFile.has(key))
                    return false;
                seenInFile.add(key);
                return true;
            });
            await delegate.deleteMany();
            await delegate.createMany({ data: uniqueProducts });
            return {
                inserted: uniqueProducts.length,
                skipped: products.length - uniqueProducts.length,
                updated: 0,
                total: products.length,
                mode,
            };
        }
        let inserted = 0;
        let updated = 0;
        const chunkSize = 50;
        for (let i = 0; i < products.length; i += chunkSize) {
            const chunk = products.slice(i, i + chunkSize);
            const existingCodes = new Set((await delegate.findMany({ where: { OR: chunk.map((p) => ({ code: { contains: p.code, mode: 'insensitive' } })) } })).map((p) => p.code));
            await Promise.all(chunk.map((p) => delegate.upsert({
                where: { code: p.code },
                update: { product: p.product, iva: p.iva, cum: p.cum, priceBox: p.priceBox, priceUnit: p.priceUnit, stopBox: p.stopBox },
                create: { ...p },
            })));
            chunk.forEach((p) => (existingCodes.has(p.code) ? updated++ : inserted++));
        }
        return { inserted, updated, total: products.length, mode };
    }
    getTemplate(providerName) {
        const ws = xlsx.utils.aoa_to_sheet([
            ['code', 'product', 'iva', 'cum', 'price_box', 'price_unit', 'stop_box'],
            ['PROD-001', 'Paracetamol 500mg', 'SI', '20161254-1', 25000, 2500, 20000],
            ['PROD-002', 'Ibuprofeno 400mg', 'NO', '20180032-1', 18000, 1800, 15000],
        ]);
        ws['!cols'] = [
            { wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
        ];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, providerName);
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map