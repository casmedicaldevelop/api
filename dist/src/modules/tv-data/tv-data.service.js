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
exports.TvDataService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = __importStar(require("xlsx"));
const prisma_service_1 = require("../../prisma/prisma.service");
let TvDataService = class TvDataService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (dto.search) {
            where.OR = [
                { code: { contains: dto.search, mode: 'insensitive' } },
                { name: { contains: dto.search, mode: 'insensitive' } },
                { inventoryCode: { contains: dto.search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.tvData.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
            this.prisma.tvData.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const record = await this.prisma.tvData.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException(`TvData con id ${id} no encontrado.`);
        return record;
    }
    async create(dto) {
        return this.prisma.tvData.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.tvData.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.tvData.delete({ where: { id } });
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
        const records = rows.map((row, i) => {
            const rowNumber = i + 2;
            const code = String(row['code'] ?? '').trim();
            const name = String(row['name'] ?? '').trim();
            if (!code)
                throw new common_1.BadRequestException(`Fila ${rowNumber}: el campo 'code' es requerido.`);
            if (!name)
                throw new common_1.BadRequestException(`Fila ${rowNumber}: el campo 'name' es requerido.`);
            const rawInventoryCode = row['inventory_code'];
            const inventoryCode = rawInventoryCode === null || rawInventoryCode === undefined
                ? null
                : String(rawInventoryCode).trim() || null;
            const rawPrice = row['price'];
            if (rawPrice === null || rawPrice === undefined || String(rawPrice).trim() === '') {
                throw new common_1.BadRequestException(`Fila ${rowNumber}: el campo 'price' es requerido.`);
            }
            const priceNum = Number(rawPrice);
            if (!Number.isInteger(priceNum) || priceNum < 0) {
                throw new common_1.BadRequestException(`Fila ${rowNumber}: el campo 'price' debe ser un entero ≥ 0 (sin decimales ni separadores).`);
            }
            return { code, name, inventoryCode, price: priceNum };
        });
        await this.prisma.$transaction([
            this.prisma.tvData.deleteMany(),
            this.prisma.tvData.createMany({ data: records }),
        ]);
        return { inserted: records.length, total: records.length };
    }
    getTemplate() {
        const ws = xlsx.utils.aoa_to_sheet([
            ['code', 'name', 'inventory_code', 'price'],
            ['TV001', 'Ejemplo TvData 1', 'INV-001', 12000],
            ['TV002', 'Ejemplo TvData 2', '', 8500],
        ]);
        ws['!cols'] = [{ wch: 16 }, { wch: 40 }, { wch: 18 }, { wch: 12 }];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'TvData');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
};
exports.TvDataService = TvDataService;
exports.TvDataService = TvDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TvDataService);
//# sourceMappingURL=tv-data.service.js.map