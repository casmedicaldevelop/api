import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';

@Injectable()
export class SystemModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
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

  async findOne(id: string) {
    const m = await this.prisma.module.findUnique({
      where: { id },
      include: { _count: { select: { employees: true } } },
    });

    if (!m) throw new NotFoundException('Módulo no encontrado');

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

  async create(dto: CreateModuleDto) {
    const existing = await this.prisma.module.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException(`Ya existe un módulo con el nombre "${dto.name}"`);

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

  async reorder(dto: ReorderModulesDto) {
    await this.prisma.$transaction(
      dto.order.map((id, index) =>
        this.prisma.module.update({ where: { id }, data: { displayOrder: index } }),
      ),
    );
  }

  async delete(id: string) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Módulo no encontrado');
    await this.prisma.module.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateModuleDto) {
    const existing = await this.prisma.module.findUnique({
      where: { id },
      include: { _count: { select: { employees: true } } },
    });
    if (!existing) throw new NotFoundException('Módulo no encontrado');

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

    const result: any = {
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
}
