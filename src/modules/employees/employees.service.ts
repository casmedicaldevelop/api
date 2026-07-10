import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AssignStaffModulesDto } from './dto/assign-staff-modules.dto';
import { ListStaffDto } from './dto/list-staff.dto';

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
} as const;

function formatStaffMember(record: any) {
  return {
    ...record,
    modules: record.modules.map((um: any) => um.module),
  };
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListStaffDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search, mode: 'insensitive' } },
        { email: { contains: dto.search, mode: 'insensitive' } },
        { username: { contains: dto.search, mode: 'insensitive' } },
      ];
    }

    if (dto.role !== undefined) where.role = dto.role;
    if (dto.isActive !== undefined) where.isActive = dto.isActive;

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

  async findOne(id: string) {
    const record = await this.prisma.employee.findUnique({ where: { id }, select: STAFF_SELECT });
    if (!record) throw new NotFoundException('Personal no encontrado');
    return formatStaffMember(record);
  }

  async create(dto: CreateStaffDto) {
    await this.assertNoDuplicate({ email: dto.email, username: dto.username, identificationNumber: dto.identificationNumber });

    if (dto.role !== 'ADMINISTRADOR' && dto.moduleIds?.length) {
      const adminOnlyModules = await this.prisma.module.findMany({
        where: { id: { in: dto.moduleIds }, isAdminOnly: true },
        select: { label: true },
      });
      if (adminOnlyModules.length > 0) {
        const names = adminOnlyModules.map((m) => m.label).join(', ');
        throw new ForbiddenException(`No se pueden asignar módulos de administración al personal: ${names}`);
      }
    }

    const temporaryPassword = randomBytes(9).toString('base64url').slice(0, 12);
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

  async update(id: string, dto: UpdateStaffDto, currentUserId: string) {
    const record = await this.prisma.employee.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Personal no encontrado');

    if (dto.isActive === false && id === currentUserId) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta');
    }

    if (dto.email || dto.username || dto.identificationNumber) {
      await this.assertNoDuplicate(
        { email: dto.email, username: dto.username, identificationNumber: dto.identificationNumber },
        id,
      );
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

  async assignModules(id: string, dto: AssignStaffModulesDto) {
    const record = await this.prisma.employee.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Personal no encontrado');

    if (record.role !== 'ADMINISTRADOR' && dto.moduleIds.length > 0) {
      const adminOnlyModules = await this.prisma.module.findMany({
        where: { id: { in: dto.moduleIds }, isAdminOnly: true },
        select: { label: true },
      });
      if (adminOnlyModules.length > 0) {
        const names = adminOnlyModules.map((m) => m.label).join(', ');
        throw new ForbiddenException(`No se pueden asignar módulos de administración al personal: ${names}`);
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
      modules: modules.map((um: any) => um.module),
    };
  }

  private async assertNoDuplicate(
    fields: { email?: string; username?: string; identificationNumber?: string },
    excludeId?: string,
  ) {
    const orClauses: any[] = [];
    if (fields.email) orClauses.push({ email: fields.email });
    if (fields.username) orClauses.push({ username: fields.username });
    if (fields.identificationNumber) orClauses.push({ identificationNumber: fields.identificationNumber });
    if (!orClauses.length) return;

    const existing = await this.prisma.employee.findFirst({
      where: { OR: orClauses, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { email: true, username: true, identificationNumber: true },
    });

    if (!existing) return;

    if (existing.email === fields.email) throw new ConflictException('El email ya está registrado');
    if (existing.username === fields.username) throw new ConflictException('El nombre de usuario ya está en uso');
    if (existing.identificationNumber === fields.identificationNumber)
      throw new ConflictException('El número de identificación ya está registrado');
  }
}
