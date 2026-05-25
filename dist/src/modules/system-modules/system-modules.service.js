"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SystemModulesService = class SystemModulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(isActive) {
        const modules = await this.prisma.module.findMany({
            where: isActive !== undefined ? { isActive } : undefined,
            orderBy: { displayOrder: 'asc' },
            include: {
                _count: { select: { employees: true } },
            },
        });
        return modules.map((m) => ({
            id: m.id,
            name: m.name,
            label: m.label,
            icon: m.icon,
            description: m.description,
            displayOrder: m.displayOrder,
            isActive: m.isActive,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            assignedUsersCount: m._count.employees,
        }));
    }
    async findOne(id) {
        const m = await this.prisma.module.findUnique({
            where: { id },
            include: { _count: { select: { employees: true } } },
        });
        if (!m)
            throw new common_1.NotFoundException('Módulo no encontrado');
        return {
            id: m.id,
            name: m.name,
            label: m.label,
            icon: m.icon,
            description: m.description,
            displayOrder: m.displayOrder,
            isActive: m.isActive,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            assignedUsersCount: m._count.employees,
        };
    }
    async create(dto) {
        const existing = await this.prisma.module.findUnique({ where: { name: dto.name } });
        if (existing)
            throw new common_1.ConflictException(`Ya existe un módulo con el nombre "${dto.name}"`);
        const maxOrder = await this.prisma.module.aggregate({ _max: { displayOrder: true } });
        const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;
        const m = await this.prisma.module.create({
            data: {
                name: dto.name,
                label: dto.label,
                icon: dto.icon,
                description: dto.description,
                displayOrder: nextOrder,
            },
            include: { _count: { select: { employees: true } } },
        });
        return {
            id: m.id,
            name: m.name,
            label: m.label,
            icon: m.icon,
            description: m.description,
            displayOrder: m.displayOrder,
            isActive: m.isActive,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            assignedUsersCount: m._count.employees,
        };
    }
    async reorder(dto) {
        await this.prisma.$transaction(dto.order.map((id, index) => this.prisma.module.update({ where: { id }, data: { displayOrder: index } })));
    }
    async delete(id) {
        const existing = await this.prisma.module.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Módulo no encontrado');
        await this.prisma.module.delete({ where: { id } });
    }
    async update(id, dto) {
        const existing = await this.prisma.module.findUnique({
            where: { id },
            include: { _count: { select: { employees: true } } },
        });
        if (!existing)
            throw new common_1.NotFoundException('Módulo no encontrado');
        const m = await this.prisma.module.update({
            where: { id },
            data: {
                ...(dto.label !== undefined && { label: dto.label }),
                ...(dto.icon !== undefined && { icon: dto.icon }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            include: { _count: { select: { employees: true } } },
        });
        const result = {
            id: m.id,
            name: m.name,
            label: m.label,
            icon: m.icon,
            description: m.description,
            displayOrder: m.displayOrder,
            isActive: m.isActive,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            assignedUsersCount: m._count.employees,
        };
        if (dto.isActive === false && existing._count.employees > 0) {
            result.warning = `${existing._count.employees} usuario(s) tienen este módulo asignado`;
        }
        return result;
    }
};
exports.SystemModulesService = SystemModulesService;
exports.SystemModulesService = SystemModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemModulesService);
//# sourceMappingURL=system-modules.service.js.map