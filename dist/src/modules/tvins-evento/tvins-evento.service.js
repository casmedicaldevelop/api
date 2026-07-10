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
exports.TvInsEventoService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = __importStar(require("xlsx"));
const prisma_service_1 = require("../../prisma/prisma.service");
const normalize_cum_1 = require("../../common/utils/normalize-cum");
const COLS = {
    cum: 'cum',
    name: 'nombre',
    value: 'valor',
    concentration: 'concentracion',
    presentation: 'presentacion',
    administrationRoute: 'via_administracion',
    shortName: 'diminutivo',
    measurementUnit: 'unidad_medida',
    pharmaceuticalForm: 'forma_farmaceutica',
    dispensingUnit: 'unidad_dispensacion',
};
const cell = (row, header) => row[header];
const WITH_REFS = {
    measurementUnitRef: true,
    dispensingUnitRef: true,
    pharmaceuticalFormRef: true,
};
let TvInsEventoService = class TvInsEventoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        const and = [];
        const like = (v) => ({ contains: v, mode: 'insensitive' });
        if (dto.cum)
            and.push({ cum: like(dto.cum) });
        if (dto.name)
            and.push({ name: like(dto.name) });
        if (dto.isActive === 'true' || dto.isActive === 'false')
            and.push({ isActive: dto.isActive === 'true' });
        if (dto.concentration)
            and.push({ concentration: like(dto.concentration) });
        if (dto.presentation)
            and.push({ presentation: like(dto.presentation) });
        if (dto.administrationRoute)
            and.push({ administrationRoute: like(dto.administrationRoute) });
        if (dto.shortName)
            and.push({ shortName: like(dto.shortName) });
        if (dto.pharmaceuticalForm)
            and.push({ pharmaceuticalForm: dto.pharmaceuticalForm });
        if (dto.measurementUnit != null)
            and.push({ measurementUnit: dto.measurementUnit });
        if (dto.dispensingUnit != null)
            and.push({ dispensingUnit: dto.dispensingUnit });
        if (dto.valueMin != null || dto.valueMax != null) {
            and.push({ value: { gte: dto.valueMin ?? undefined, lte: dto.valueMax ?? undefined } });
        }
        if (and.length)
            where.AND = and;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.tvInsEvento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
                include: WITH_REFS,
            }),
            this.prisma.tvInsEvento.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const record = await this.prisma.tvInsEvento.findUnique({ where: { id }, include: WITH_REFS });
        if (!record)
            throw new common_1.NotFoundException(`Registro tvins_evento con id ${id} no encontrado.`);
        return record;
    }
    async findByCum(cum) {
        return this.prisma.tvInsEvento.findMany({
            where: { cum: (0, normalize_cum_1.normalizeCum)(cum) ?? cum.trim(), isActive: true },
            orderBy: { id: 'asc' },
            include: WITH_REFS,
        });
    }
    async assertRefs(measurementUnit, dispensingUnit, pharmaceuticalForm) {
        if (typeof measurementUnit === 'number') {
            const u = await this.prisma.scientificUnit.findUnique({ where: { code: measurementUnit } });
            if (!u)
                throw new common_1.BadRequestException(`La unidad de medida con código ${measurementUnit} no existe en el catálogo.`);
        }
        if (typeof dispensingUnit === 'number') {
            const u = await this.prisma.measurementUnit.findUnique({ where: { code: dispensingUnit } });
            if (!u)
                throw new common_1.BadRequestException(`La unidad de dispensación con código ${dispensingUnit} no existe en el catálogo.`);
        }
        if (pharmaceuticalForm !== undefined) {
            const f = await this.prisma.pharmaceuticalForm.findUnique({ where: { code: pharmaceuticalForm } });
            if (!f)
                throw new common_1.BadRequestException(`La forma farmacéutica con código ${pharmaceuticalForm} no existe en el catálogo.`);
        }
    }
    async create(dto) {
        await this.assertRefs(dto.measurementUnit, dto.dispensingUnit, dto.pharmaceuticalForm);
        return this.prisma.tvInsEvento.create({
            data: { ...dto, cum: (0, normalize_cum_1.normalizeCum)(dto.cum) ?? dto.cum, isActive: true },
            include: WITH_REFS,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.assertRefs(dto.measurementUnit, dto.dispensingUnit, dto.pharmaceuticalForm);
        return this.prisma.tvInsEvento.update({
            where: { id },
            data: { ...dto, ...(dto.cum !== undefined && { cum: (0, normalize_cum_1.normalizeCum)(dto.cum) ?? dto.cum }) },
            include: WITH_REFS,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.tvInsEvento.delete({ where: { id } });
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
        const [scientificUnits, dispensingUnits, forms] = await Promise.all([
            this.prisma.scientificUnit.findMany({ select: { code: true } }),
            this.prisma.measurementUnit.findMany({ select: { code: true } }),
            this.prisma.pharmaceuticalForm.findMany({ select: { code: true } }),
        ]);
        const validMeasurement = new Set(scientificUnits.map((u) => u.code));
        const validDispensing = new Set(dispensingUnits.map((u) => u.code));
        const validForms = new Set(forms.map((f) => f.code));
        const errors = [];
        const getStr = (row, header, rowNumber) => {
            const v = cell(row, header);
            const s = v === null || v === undefined ? '' : String(v).trim();
            if (!s)
                errors.push({ row: rowNumber, column: header, reason: 'requerido (está vacío)' });
            return s;
        };
        const getInt = (row, header, rowNumber) => {
            const v = cell(row, header);
            if (v === null || v === undefined || String(v).trim() === '') {
                errors.push({ row: rowNumber, column: header, reason: 'requerido (está vacío)' });
                return null;
            }
            const n = Number(v);
            if (!Number.isInteger(n)) {
                errors.push({ row: rowNumber, column: header, reason: `debe ser un entero (recibido: "${String(v).trim()}")` });
                return null;
            }
            return n;
        };
        const records = rows.map((row, i) => {
            const rowNumber = i + 2;
            const cumRaw = getStr(row, COLS.cum, rowNumber);
            const cum = (0, normalize_cum_1.normalizeCum)(cumRaw) ?? cumRaw;
            const name = getStr(row, COLS.name, rowNumber);
            const value = getInt(row, COLS.value, rowNumber);
            if (value !== null && value < 0)
                errors.push({ row: rowNumber, column: COLS.value, reason: 'debe ser ≥ 0' });
            const concentration = getStr(row, COLS.concentration, rowNumber);
            const presentation = getStr(row, COLS.presentation, rowNumber);
            const administrationRoute = getStr(row, COLS.administrationRoute, rowNumber);
            const shortName = getStr(row, COLS.shortName, rowNumber);
            const measurementUnit = getInt(row, COLS.measurementUnit, rowNumber);
            const pharmaceuticalForm = getStr(row, COLS.pharmaceuticalForm, rowNumber);
            const dispensingUnit = getInt(row, COLS.dispensingUnit, rowNumber);
            if (measurementUnit !== null && !validMeasurement.has(measurementUnit)) {
                errors.push({ row: rowNumber, column: COLS.measurementUnit, reason: `el código ${measurementUnit} no existe en el catálogo de unidades de medida` });
            }
            if (dispensingUnit !== null && !validDispensing.has(dispensingUnit)) {
                errors.push({ row: rowNumber, column: COLS.dispensingUnit, reason: `el código ${dispensingUnit} no existe en el catálogo de unidades de dispensación` });
            }
            if (pharmaceuticalForm && !validForms.has(pharmaceuticalForm)) {
                errors.push({ row: rowNumber, column: COLS.pharmaceuticalForm, reason: `el código ${pharmaceuticalForm} no existe en el catálogo de formas farmacéuticas` });
            }
            return {
                cum, name, value, concentration, presentation,
                administrationRoute, shortName, measurementUnit, pharmaceuticalForm, dispensingUnit,
            };
        });
        if (errors.length) {
            const MAX = 200;
            throw new common_1.BadRequestException({
                message: `El archivo tiene ${errors.length} error(es). Corrige las filas indicadas y vuelve a subirlo.`,
                errors: errors.slice(0, MAX),
                truncated: errors.length > MAX ? errors.length - MAX : 0,
            });
        }
        const data = records.map((r) => ({
            ...r,
            value: r.value,
            measurementUnit: r.measurementUnit,
            dispensingUnit: r.dispensingUnit,
            isActive: true,
        }));
        await this.prisma.tvInsEvento.createMany({ data });
        return { inserted: data.length, total: data.length };
    }
    getTemplate() {
        const ws = xlsx.utils.aoa_to_sheet([
            [COLS.cum, COLS.name, COLS.value, COLS.concentration, COLS.presentation, COLS.administrationRoute, COLS.shortName, COLS.measurementUnit, COLS.pharmaceuticalForm, COLS.dispensingUnit],
            ['20012345', 'Ejemplo medicamento', 12000, '500 mg', 'Caja x 10', 'Oral', 'EJ MED', 168, 'C42966', 11],
        ]);
        ws['!cols'] = [
            { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 16 }, { wch: 18 },
            { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
        ];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'tvins_evento');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    getUpdateTemplate() {
        const ws = xlsx.utils.aoa_to_sheet([
            [COLS.cum, COLS.name, COLS.value],
            ['20012345', 'Ejemplo medicamento', 12000],
        ]);
        ws['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 10 }];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'actualizacion');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    readSheet(file) {
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
        return rows;
    }
    async previewUpdate(file) {
        const rows = this.readSheet(file);
        const errors = [];
        const parsed = [];
        rows.forEach((row, i) => {
            const rowNumber = i + 2;
            const cumRaw = cell(row, COLS.cum);
            const cumTrim = cumRaw === null || cumRaw === undefined ? '' : String(cumRaw).trim();
            const cum = cumTrim ? (0, normalize_cum_1.normalizeCum)(cumTrim) ?? cumTrim : '';
            if (!cum)
                errors.push({ row: rowNumber, column: COLS.cum, reason: 'requerido (está vacío)' });
            const nameRaw = cell(row, COLS.name);
            const name = nameRaw === null || nameRaw === undefined ? '' : String(nameRaw).trim();
            const vRaw = cell(row, COLS.value);
            let value = null;
            if (vRaw === null || vRaw === undefined || String(vRaw).trim() === '') {
                errors.push({ row: rowNumber, column: COLS.value, reason: 'requerido (está vacío)' });
            }
            else {
                const n = Number(vRaw);
                if (!Number.isInteger(n))
                    errors.push({ row: rowNumber, column: COLS.value, reason: `debe ser un entero (recibido: "${String(vRaw).trim()}")` });
                else if (n < 0)
                    errors.push({ row: rowNumber, column: COLS.value, reason: 'debe ser ≥ 0' });
                else
                    value = n;
            }
            if (cum && value !== null)
                parsed.push({ rowNumber, cum, name, value });
        });
        const cums = [...new Set(parsed.map((p) => p.cum))];
        const existing = cums.length
            ? await this.prisma.tvInsEvento.findMany({
                where: { cum: { in: cums } },
                select: { id: true, cum: true, name: true, value: true, concentration: true, presentation: true, shortName: true },
            })
            : [];
        const byCum = new Map();
        for (const r of existing) {
            const arr = byCum.get(r.cum) ?? [];
            arr.push(r);
            byCum.set(r.cum, arr);
        }
        const directs = [];
        const conflicts = [];
        const missing = [];
        for (const p of parsed) {
            const matches = byCum.get(p.cum) ?? [];
            if (matches.length === 0) {
                missing.push({ cum: p.cum, name: p.name, value: p.value });
            }
            else if (matches.length === 1) {
                directs.push({ row: p.rowNumber, cum: p.cum, name: p.name, value: p.value, target: { id: matches[0].id, name: matches[0].name, value: matches[0].value } });
            }
            else {
                conflicts.push({
                    row: p.rowNumber, cum: p.cum, name: p.name, value: p.value,
                    candidates: matches.map((m) => ({ id: m.id, name: m.name, value: m.value, concentration: m.concentration, presentation: m.presentation, shortName: m.shortName })),
                });
            }
        }
        return { directs, conflicts, missing, errors };
    }
    async applyUpdate(items) {
        if (!items?.length)
            return { updated: 0 };
        const ids = items.map((i) => i.id);
        const found = await this.prisma.tvInsEvento.findMany({ where: { id: { in: ids } }, select: { id: true } });
        const set = new Set(found.map((f) => f.id));
        for (const it of items) {
            if (!set.has(it.id))
                throw new common_1.BadRequestException(`El registro con id ${it.id} no existe.`);
            if (!Number.isInteger(it.value) || it.value < 0)
                throw new common_1.BadRequestException(`Valor inválido para el id ${it.id}: debe ser un entero ≥ 0.`);
        }
        await this.prisma.$transaction(items.map((it) => this.prisma.tvInsEvento.update({ where: { id: it.id }, data: { value: it.value, isActive: true } })));
        return { updated: items.length };
    }
    getMissingTemplate(rows) {
        const header = [COLS.cum, COLS.name, COLS.value, COLS.concentration, COLS.presentation, COLS.administrationRoute, COLS.shortName, COLS.measurementUnit, COLS.pharmaceuticalForm, COLS.dispensingUnit];
        const body = (rows ?? []).map((r) => [r.cum, r.name, r.value, '', '', '', '', '', '', '']);
        const ws = xlsx.utils.aoa_to_sheet([header, ...body]);
        ws['!cols'] = [
            { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 16 }, { wch: 18 },
            { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
        ];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'tvins_evento');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
};
exports.TvInsEventoService = TvInsEventoService;
exports.TvInsEventoService = TvInsEventoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TvInsEventoService);
//# sourceMappingURL=tvins-evento.service.js.map