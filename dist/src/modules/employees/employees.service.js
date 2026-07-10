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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
const STAFF_SELECT = {
    id: true,
    name: true,
    email: true,
    username: true,
    phone: true,
    identificationNumber: true,
    role: true,
    isActive: true,
    mustChangePassword: true,
    createdAt: true,
    updatedAt: true,
    modules: {
        include: { module: { select: { id: true, name: true, label: true, icon: true } } },
    },
};
function formatStaffMember(record) {
    return {
        ...record,
        modules: record.modules.map((um) => um.module),
    };
}
let EmployeesService = class EmployeesService {
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
                { name: { contains: dto.search, mode: 'insensitive' } },
                { email: { contains: dto.search, mode: 'insensitive' } },
                { username: { contains: dto.search, mode: 'insensitive' } },
            ];
        }
        if (dto.role !== undefined)
            where.role = dto.role;
        if (dto.isActive !== undefined)
            where.isActive = dto.isActive;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.employee.findMany({
                where,
                select: STAFF_SELECT,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.employee.count({ where }),
        ]);
        return {
            data: data.map(formatStaffMember),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const record = await this.prisma.employee.findUnique({ where: { id }, select: STAFF_SELECT });
        if (!record)
            throw new common_1.NotFoundException('Personal no encontrado');
        return formatStaffMember(record);
    }
    async create(dto) {
        await this.assertNoDuplicate({ email: dto.email, username: dto.username, identificationNumber: dto.identificationNumber });
        if (dto.role !== 'ADMINISTRADOR' && dto.moduleIds?.length) {
            const adminOnlyModules = await this.prisma.module.findMany({
                where: { id: { in: dto.moduleIds }, isAdminOnly: true },
                select: { label: true },
            });
            if (adminOnlyModules.length > 0) {
                const names = adminOnlyModules.map((m) => m.label).join(', ');
                throw new common_1.ForbiddenException(`No se pueden asignar módulos de administración al personal: ${names}`);
            }
        }
        const temporaryPassword = (0, crypto_1.randomBytes)(9).toString('base64url').slice(0, 12);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        const record = await this.prisma.employee.create({
            data: {
                name: dto.name,
                email: dto.email,
                username: dto.username,
                identificationNumber: dto.identificationNumber,
                phone: dto.phone,
                role: dto.role,
                password: hashedPassword,
                mustChangePassword: true,
                ...(dto.moduleIds?.length
                    ? {
                        modules: {
                            create: dto.moduleIds.map((moduleId) => ({ moduleId })),
                        },
                    }
                    : {}),
            },
            select: { id: true, name: true, email: true, username: true },
        });
        return { ...record, temporaryPassword };
    }
    async update(id, dto, currentUserId) {
        const record = await this.prisma.employee.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('Personal no encontrado');
        if (dto.isActive === false && id === currentUserId) {
            throw new common_1.BadRequestException('No puedes desactivar tu propia cuenta');
        }
        if (dto.email || dto.username || dto.identificationNumber) {
            await this.assertNoDuplicate({ email: dto.email, username: dto.username, identificationNumber: dto.identificationNumber }, id);
        }
        const updated = await this.prisma.employee.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.email !== undefined && { email: dto.email }),
                ...(dto.username !== undefined && { username: dto.username }),
                ...(dto.identificationNumber !== undefined && { identificationNumber: dto.identificationNumber }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.role !== undefined && { role: dto.role }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            select: STAFF_SELECT,
        });
        return formatStaffMember(updated);
    }
    async assignModules(id, dto) {
        const record = await this.prisma.employee.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('Personal no encontrado');
        if (record.role !== 'ADMINISTRADOR' && dto.moduleIds.length > 0) {
            const adminOnlyModules = await this.prisma.module.findMany({
                where: { id: { in: dto.moduleIds }, isAdminOnly: true },
                select: { label: true },
            });
            if (adminOnlyModules.length > 0) {
                const names = adminOnlyModules.map((m) => m.label).join(', ');
                throw new common_1.ForbiddenException(`No se pueden asignar módulos de administración al personal: ${names}`);
            }
        }
        const [, modules] = await this.prisma.$transaction([
            this.prisma.employeeModule.deleteMany({ where: { employeeId: id } }),
            this.prisma.employeeModule.createManyAndReturn({
                data: dto.moduleIds.map((moduleId) => ({ employeeId: id, moduleId })),
                include: { module: { select: { id: true, name: true, label: true, icon: true } } },
            }),
        ]);
        return {
            message: 'Módulos actualizados',
            modules: modules.map((um) => um.module),
        };
    }
    async assertNoDuplicate(fields, excludeId) {
        const orClauses = [];
        if (fields.email)
            orClauses.push({ email: fields.email });
        if (fields.username)
            orClauses.push({ username: fields.username });
        if (fields.identificationNumber)
            orClauses.push({ identificationNumber: fields.identificationNumber });
        if (!orClauses.length)
            return;
        const existing = await this.prisma.employee.findFirst({
            where: { OR: orClauses, ...(excludeId ? { id: { not: excludeId } } : {}) },
            select: { email: true, username: true, identificationNumber: true },
        });
        if (!existing)
            return;
        if (existing.email === fields.email)
            throw new common_1.ConflictException('El email ya está registrado');
        if (existing.username === fields.username)
            throw new common_1.ConflictException('El nombre de usuario ya está en uso');
        if (existing.identificationNumber === fields.identificationNumber)
            throw new common_1.ConflictException('El número de identificación ya está registrado');
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map