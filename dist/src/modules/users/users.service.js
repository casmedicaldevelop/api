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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = __importStar(require("xlsx"));
const prisma_service_1 = require("../../prisma/prisma.service");
const drive_service_1 = require("../drive/drive.service");
const COLUMN_ALIASES = {
    id: ['id', 'ID', 'cedula', 'cédula', 'Cedula', 'Cédula', 'CEDULA', 'identificacion', 'Identificacion'],
    firstName: ['firstName', 'primer_nombre', 'primerNombre', 'Primer Nombre', 'PRIMER_NOMBRE', 'first_name'],
    secondName: ['secondName', 'segundo_nombre', 'segundoNombre', 'Segundo Nombre', 'SEGUNDO_NOMBRE', 'second_name'],
    firstSurname: ['firstSurname', 'primer_apellido', 'primerApellido', 'Primer Apellido', 'PRIMER_APELLIDO', 'first_surname'],
    secondSurname: ['secondSurname', 'segundo_apellido', 'segundoApellido', 'Segundo Apellido', 'SEGUNDO_APELLIDO', 'second_surname'],
    phone: ['phone', 'Phone', 'telefono', 'teléfono', 'Telefono', 'Teléfono', 'TELEFONO'],
    email: ['email', 'Email', 'EMAIL', 'correo', 'Correo'],
    birthDate: ['birthDate', 'birth_date', 'fechaNacimiento', 'fecha_nacimiento', 'FechaNacimiento', 'fecha nacimiento'],
    city: ['city', 'City', 'ciudad', 'Ciudad', 'CIUDAD'],
    neighborhood: ['neighborhood', 'barrio', 'Barrio', 'BARRIO'],
    address: ['address', 'Address', 'direccion', 'dirección', 'Direccion', 'Dirección', 'DIRECCION'],
    description: ['description', 'Description', 'descripcion', 'descripción', 'Descripcion'],
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
    const id = String(resolveCol(row, 'id') ?? '').trim();
    const firstName = String(resolveCol(row, 'firstName') ?? '').trim().toUpperCase();
    const firstSurname = String(resolveCol(row, 'firstSurname') ?? '').trim().toUpperCase();
    const phone = String(resolveCol(row, 'phone') ?? '').trim();
    if (!id)
        throw new common_1.BadRequestException(`Fila ${index + 2}: la cédula es requerida.`);
    if (!/^\d+$/.test(id))
        throw new common_1.BadRequestException(`Fila ${index + 2}: la cédula solo debe contener dígitos.`);
    if (!firstName)
        throw new common_1.BadRequestException(`Fila ${index + 2}: el primer nombre es requerido.`);
    if (!firstSurname)
        throw new common_1.BadRequestException(`Fila ${index + 2}: el primer apellido es requerido.`);
    if (!/^\d{10}$/.test(phone))
        throw new common_1.BadRequestException(`Fila ${index + 2}: el teléfono debe tener exactamente 10 dígitos.`);
    const emailRaw = resolveCol(row, 'email');
    const email = emailRaw != null && String(emailRaw).trim() !== '' ? String(emailRaw).trim().toUpperCase() : undefined;
    const birthDateRaw = resolveCol(row, 'birthDate');
    let birthDate;
    if (birthDateRaw != null && String(birthDateRaw).trim() !== '') {
        const raw = String(birthDateRaw).trim();
        const asDate = new Date(raw);
        birthDate = !isNaN(asDate.getTime()) ? asDate.toISOString() : undefined;
    }
    const upperStr = (field) => {
        const v = resolveCol(row, field);
        return v != null && String(v).trim() !== '' ? String(v).trim().toUpperCase() : undefined;
    };
    return {
        id,
        firstName,
        secondName: upperStr('secondName'),
        firstSurname,
        secondSurname: upperStr('secondSurname'),
        phone,
        email,
        birthDate,
        city: upperStr('city'),
        neighborhood: upperStr('neighborhood'),
        address: upperStr('address'),
        description: upperStr('description'),
    };
}
let UsersService = class UsersService {
    prisma;
    drive;
    constructor(prisma, drive) {
        this.prisma = prisma;
        this.drive = drive;
    }
    async findAll(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const term = dto.search?.trim();
        const where = {};
        if (dto.isActive !== undefined)
            where.isActive = dto.isActive;
        if (dto.city)
            where.city = { contains: dto.city, mode: 'insensitive' };
        if (term) {
            where.OR = [
                { id: { contains: term, mode: 'insensitive' } },
                { firstName: { contains: term, mode: 'insensitive' } },
                { secondName: { contains: term, mode: 'insensitive' } },
                { firstSurname: { contains: term, mode: 'insensitive' } },
                { secondSurname: { contains: term, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                orderBy: [{ firstSurname: 'asc' }, { firstName: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const record = await this.prisma.user.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return record;
    }
    async findOneOrNull(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async create(dto) {
        const exists = await this.prisma.user.findUnique({ where: { id: dto.id } });
        if (exists)
            throw new common_1.ConflictException(`La cédula ${dto.id} ya está registrada`);
        return this.prisma.user.create({
            data: {
                id: dto.id,
                documentType: dto.documentType ?? null,
                gender: dto.gender ?? null,
                firstName: dto.firstName,
                secondName: dto.secondName,
                firstSurname: dto.firstSurname,
                secondSurname: dto.secondSurname,
                phone: dto.phone,
                email: dto.email,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
                birthDateApproximate: dto.birthDateApproximate ?? false,
                healthcareRegime: dto.healthcareRegime ?? null,
                department: dto.department,
                city: dto.city,
                neighborhood: dto.neighborhood,
                address: dto.address,
                description: dto.description,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(dto.documentType !== undefined && { documentType: dto.documentType }),
                ...(dto.gender !== undefined && { gender: dto.gender }),
                ...(dto.firstName !== undefined && { firstName: dto.firstName }),
                ...(dto.secondName !== undefined && { secondName: dto.secondName }),
                ...(dto.firstSurname !== undefined && { firstSurname: dto.firstSurname }),
                ...(dto.secondSurname !== undefined && { secondSurname: dto.secondSurname }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.email !== undefined && { email: dto.email }),
                ...(dto.birthDate !== undefined && { birthDate: dto.birthDate ? new Date(dto.birthDate) : null }),
                ...(dto.birthDateApproximate !== undefined && { birthDateApproximate: dto.birthDateApproximate }),
                ...(dto.healthcareRegime !== undefined && { healthcareRegime: dto.healthcareRegime }),
                ...(dto.department !== undefined && { department: dto.department }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.neighborhood !== undefined && { neighborhood: dto.neighborhood }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async bulkImport(file) {
        if (!file)
            throw new common_1.BadRequestException('No se proporcionó ningún archivo.');
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls'].includes(ext ?? '')) {
            throw new common_1.BadRequestException('Solo se aceptan archivos .xlsx o .xls.');
        }
        let workbook;
        try {
            workbook = xlsx.read(file.buffer, { type: 'buffer' });
        }
        catch {
            throw new common_1.BadRequestException('El archivo no pudo ser leído. Verifique que sea un Excel válido.');
        }
        const sheetName = workbook.SheetNames[0];
        if (!sheetName)
            throw new common_1.BadRequestException('El archivo no contiene ninguna hoja de datos.');
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
        if (rows.length === 0)
            throw new common_1.BadRequestException('El archivo está vacío.');
        const parsed = rows.map((row, i) => parseRow(row, i));
        const inFileIds = parsed.map((r) => r.id);
        const inFileDuplicates = inFileIds.filter((id, i) => inFileIds.indexOf(id) !== i);
        if (inFileDuplicates.length > 0) {
            const unique = [...new Set(inFileDuplicates)];
            throw new common_1.BadRequestException({
                message: 'El archivo contiene cédulas duplicadas entre filas',
                duplicates: unique,
            });
        }
        const existing = await this.prisma.user.findMany({
            where: { id: { in: inFileIds } },
            select: { id: true },
        });
        if (existing.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Las siguientes cédulas ya están registradas en el sistema',
                duplicates: existing.map((r) => r.id),
            });
        }
        await this.prisma.$transaction(parsed.map((u) => this.prisma.user.create({
            data: {
                id: u.id,
                firstName: u.firstName,
                secondName: u.secondName,
                firstSurname: u.firstSurname,
                secondSurname: u.secondSurname,
                phone: u.phone,
                email: u.email,
                birthDate: u.birthDate ? new Date(u.birthDate) : null,
                city: u.city,
                neighborhood: u.neighborhood,
                address: u.address,
                description: u.description,
            },
        })));
        return { inserted: parsed.length };
    }
    getTemplate() {
        const ws = xlsx.utils.aoa_to_sheet([
            ['cedula', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'telefono', 'correo', 'fecha_nacimiento', 'ciudad', 'barrio', 'direccion', 'descripcion'],
            ['1234567890', 'María', '', 'García', 'López', '3001234567', 'maria@email.com', '1985-06-15', 'Bogotá', 'Chapinero', 'Cra 7 # 45-20', 'Afiliada EPS Sura'],
            ['9876543210', 'Juan', 'Carlos', 'Pérez', 'Gómez', '3109876543', '', '1990-03-22', 'Medellín', 'El Poblado', '', ''],
        ]);
        ws['!cols'] = [
            { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 13 }, { wch: 26 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 24 }, { wch: 30 },
        ];
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Usuarios');
        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    async filesRootId(userId) {
        const row = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!row)
            throw new common_1.NotFoundException(`Usuario con cédula ${userId} no encontrado`);
        return this.drive.ensureUserRoot(userId);
    }
    async assertInTree(itemId, rootId) {
        if (!(await this.drive.isWithinTree(itemId, rootId))) {
            throw new common_1.ForbiddenException('El elemento no pertenece a este usuario.');
        }
    }
    async enrichFolders(items) {
        return Promise.all(items.map(async (it) => {
            if (!it.isFolder)
                return it;
            const children = await this.drive.listChildren(it.id);
            const folderSizeBytes = children
                .filter((c) => !c.isFolder)
                .reduce((acc, c) => acc + (Number(c.size) || 0), 0);
            return { ...it, childCount: children.length, folderSizeBytes };
        }));
    }
    async filesRoot(userId) {
        const rootId = await this.filesRootId(userId);
        const [rawItems, path] = await Promise.all([
            this.drive.listChildren(rootId),
            this.drive.pathTo(rootId, rootId),
        ]);
        const items = await this.enrichFolders(rawItems);
        return { rootId, folderId: rootId, path, items };
    }
    async filesTree(userId) {
        const rootId = await this.filesRootId(userId);
        const tree = await this.drive.listFolderTree(rootId);
        return { rootId, tree };
    }
    async filesList(userId, folderId) {
        const rootId = await this.filesRootId(userId);
        await this.assertInTree(folderId, rootId);
        const [rawItems, path] = await Promise.all([
            this.drive.listChildren(folderId),
            this.drive.pathTo(folderId, rootId),
        ]);
        const items = await this.enrichFolders(rawItems);
        return { rootId, folderId, path, items };
    }
    async filesCreateFolder(userId, folderId, name) {
        const clean = (name ?? '').trim();
        if (!clean)
            throw new common_1.BadRequestException('El nombre de la carpeta es obligatorio.');
        const rootId = await this.filesRootId(userId);
        await this.assertInTree(folderId, rootId);
        return this.drive.createFolder(folderId, clean);
    }
    async filesUpload(userId, folderId, file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo.');
        const rootId = await this.filesRootId(userId);
        await this.assertInTree(folderId, rootId);
        return this.drive.uploadToFolder(folderId, file.buffer, file.originalname, file.mimetype);
    }
    async filesDelete(userId, itemId) {
        const rootId = await this.filesRootId(userId);
        if (itemId === rootId) {
            throw new common_1.BadRequestException('No se puede eliminar la carpeta raíz del usuario.');
        }
        await this.assertInTree(itemId, rootId);
        await this.drive.deleteItem(itemId);
        return { ok: true };
    }
    async filesContent(userId, itemId) {
        const rootId = await this.filesRootId(userId);
        await this.assertInTree(itemId, rootId);
        return this.drive.getStream(itemId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        drive_service_1.DriveService])
], UsersService);
//# sourceMappingURL=users.service.js.map