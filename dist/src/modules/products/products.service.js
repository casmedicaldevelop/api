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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = __importStar(require("xlsx"));
const prisma_service_1 = require("../../prisma/prisma.service");
const normalize_cum_1 = require("../../common/utils/normalize-cum");
const COLUMN_ALIASES = {
    code: ['code', 'Code', 'CODE', 'codigo', 'CODIGO', 'Codigo'],
    product: ['product', 'Product', 'PRODUCT', 'producto', 'PRODUCTO', 'nombre', 'NOMBRE', 'Nombre'],
    cum: ['cum', 'CUM', 'Cum'],
    box: ['box', 'Box', 'BOX', 'cajas', 'CAJAS', 'Cajas'],
    unit: ['unit', 'Unit', 'UNIT', 'unidades', 'UNIDADES', 'Unidades'],
    lot: ['lot', 'Lot', 'LOT', 'lote', 'Lote', 'LOTE'],
    warehouse: ['warehouse', 'Warehouse', 'WAREHOUSE', 'bodega', 'Bodega', 'BODEGA'],
};
function resolveCol(row, field) {
    const aliases = COLUMN_ALIASES[field] ?? [field];
    for (const alias of aliases) {
        if (alias in row)
            return row[alias];
    }
    return undefined;
}
function parseRow(row, index) {
    const code = String(resolveCol(row, 'code') ?? '').trim();
    const product = String(resolveCol(row, 'product') ?? '').trim();
    const lot = String(resolveCol(row, 'lot') ?? '').trim();
    const warehouseRaw = resolveCol(row, 'warehouse');
    const cumRaw = resolveCol(row, 'cum');
    const boxRaw = resolveCol(row, 'box');
    const unitRaw = resolveCol(row, 'unit');
    if (!code)
        throw new common_1.BadRequestException(`Fila ${index + 2}: el campo 'code' es requerido.`);
    if (!product)
        throw new common_1.BadRequestException(`Fila ${index + 2}: el campo 'product' es requerido.`);
    if (!lot)
        throw new common_1.BadRequestException(`Fila ${index + 2}: el campo 'lote' es requerido.`);
    if (warehouseRaw === undefined || warehouseRaw === null || String(warehouseRaw).trim() === '') {
        throw new common_1.BadRequestException(`Fila ${index + 2}: el campo 'bodega' es requerido.`);
    }
    const warehouse = parseInt(String(warehouseRaw).trim(), 10);
    if (isNaN(warehouse))
        throw new common_1.BadRequestException(`Fila ${index + 2}: el campo 'bodega' debe ser un número (ej: 1, 4).`);
    const cum = (0, normalize_cum_1.normalizeCum)(cumRaw !== undefined && cumRaw !== null ? String(cumRaw) : null);
    const box = boxRaw !== undefined ? Math.max(0, parseInt(String(boxRaw), 10) || 0) : 0;
    const unit = unitRaw !== undefined ? Math.max(0, parseInt(String(unitRaw), 10) || 0) : 0;
    return { code, product, cum, box, unit, lot, warehouse };
}
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (dto.isActive !== undefined)
            where.isActive = dto.isActive;
        if (dto.search) {
            const searchNum = parseInt(dto.search, 10);
            where.OR = [
                { code: { contains: dto.search, mode: 'insensitive' } },
                { product: { contains: dto.search, mode: 'insensitive' } },
                { cum: { contains: dto.search, mode: 'insensitive' } },
                { lot: { contains: dto.search, mode: 'insensitive' } },
                ...(!isNaN(searchNum) ? [{ warehouse: searchNum }] : []),
            ];
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({ where, skip, take: limit, orderBy: { code: 'asc' } }),
            this.prisma.product.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        return product;
    }
    async create(dto) {
        return this.prisma.product.create({
            data: { ...dto, cum: (0, normalize_cum_1.normalizeCum)(dto.cum) },
        }).catch((err) => {
            if (err.code === 'P2002') {
                throw new common_1.ConflictException(`Ya existe un producto con el código '${dto.code}', lote '${dto.lot}' y bodega '${dto.warehouse}'.`);
            }
            throw err;
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { ...dto, ...(dto.cum !== undefined && { cum: (0, normalize_cum_1.normalizeCum)(dto.cum) }) },
        }).catch((err) => {
            if (err.code === 'P2002') {
                throw new common_1.ConflictException('Ya existe un producto con esa combinación de código, lote y bodega.');
            }
            throw err;
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({ where: { id } });
    }
    async bulkUpload(file) {
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
        const products = rows.map((row, i) => parseRow(row, i));
        const seenInFile = new Set();
        const uniqueProducts = products.filter((p) => {
            const key = `${p.code.toLowerCase()}|${p.lot.toLowerCase()}|${p.warehouse}`;
            if (seenInFile.has(key))
                return false;
            seenInFile.add(key);
            return true;
        });
        await this.prisma.$transaction([
            this.prisma.product.deleteMany(),
            this.prisma.product.createMany({ data: uniqueProducts }),
        ]);
        return {
            inserted: uniqueProducts.length,
            skipped: products.length - uniqueProducts.length,
            total: products.length,
        };
    }
    async getCumPendingProvider1() {
        const pending = await this.prisma.product.findMany({
            where: { cum: null, cumSkipped: false },
            distinct: ['code'],
            orderBy: { code: 'asc' },
            select: { code: true, product: true },
        });
        const total = pending.length;
        if (total === 0)
            return { total: 0, next: null };
        const first = pending[0];
        const affectedRows = await this.prisma.product.count({
            where: { code: first.code, cum: null },
        });
        return { total, next: { code: first.code, product: first.product, affectedRows } };
    }
    async getCumSuggestionsProvider1(q) {
        if (!q || q.trim().length < 2)
            return [];
        const tokens = extractSearchTokens(q);
        if (tokens.length === 0)
            return [];
        for (let count = Math.min(tokens.length, 4); count >= 1; count--) {
            const subset = tokens.slice(0, count);
            const results = await this.prisma.provider1.findMany({
                where: { AND: subset.map((t) => ({ product: { contains: t, mode: 'insensitive' } })) },
                take: 10,
                orderBy: { product: 'asc' },
                select: { code: true, product: true, cum: true },
            });
            if (results.length > 0)
                return results;
        }
        return [];
    }
    async assignCumProvider1(dto) {
        const result = await this.prisma.product.updateMany({
            where: { code: dto.code, cum: null },
            data: { cum: (0, normalize_cum_1.normalizeCum)(dto.cum) },
        });
        return { updated: result.count };
    }
    async skipCumProvider1(dto) {
        const result = await this.prisma.product.updateMany({
            where: { code: dto.code },
            data: { cumSkipped: true },
        });
        return { updated: result.count };
    }
    getTemplate() {
        const ws = xlsx.utils.aoa_to_sheet([
            ['code', 'product', 'cum', 'box', 'unit', 'lot', 'warehouse'],
            ['PROD-001', 'Paracetamol 500mg', '20161254-1', 10, 120, 'L2024-001', 1],
            ['PROD-001', 'Paracetamol 500mg', '20161254-1', 5, 60, 'L2024-002', 4],
            ['PROD-002', 'Ibuprofeno 400mg', '20180032-1', 8, 96, 'L2024-003', 1],
        ]);
        ws['!cols'] = [
            { wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 16 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 18 },
        ];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Productos');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
const SEARCH_NOISE = new Set([
    'TAB', 'CAP', 'SOL', 'INY', 'FCO', 'FCOX', 'CJX', 'BOL', 'AMP', 'VIAL',
    'LIB', 'PRO', 'RET', 'EXT', 'GEL', 'CRE', 'UNG', 'POM', 'JBE', 'SUS',
    'EMP', 'IND', 'PAQ', 'GR', 'KIT', 'PRE', 'PEN', 'INH', 'NEB', 'TEM',
    'DE', 'DEL', 'EL', 'LA', 'LOS', 'LAS', 'CON', 'SIN', 'POR', 'PARA', 'Y',
    'CART', 'TUBO', 'JERINGAS', 'JERINGA', 'SOBRE', 'SOBRES',
]);
function extractSearchTokens(name) {
    return name
        .toUpperCase()
        .replace(/[*()\-,._+/]/g, ' ')
        .split(/\s+/)
        .filter((t) => {
        if (t.length < 3)
            return false;
        if (/^\d+$/.test(t))
            return false;
        if (/^CX\d+/.test(t))
            return false;
        if (/^C\*/.test(t))
            return false;
        if (SEARCH_NOISE.has(t))
            return false;
        return true;
    })
        .slice(0, 5);
}
//# sourceMappingURL=products.service.js.map