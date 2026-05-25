import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as xlsx from 'xlsx';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { ListServiceUsersDto } from './dto/list-service-users.dto';

interface RawRow {
  [key: string]: string | number | null | undefined;
}

const COLUMN_ALIASES: Record<string, string[]> = {
  id:            ['id', 'ID', 'cedula', 'cédula', 'Cedula', 'Cédula', 'CEDULA', 'identificacion', 'Identificacion'],
  firstName:     ['firstName', 'primer_nombre', 'primerNombre', 'Primer Nombre', 'PRIMER_NOMBRE', 'first_name'],
  secondName:    ['secondName', 'segundo_nombre', 'segundoNombre', 'Segundo Nombre', 'SEGUNDO_NOMBRE', 'second_name'],
  firstSurname:  ['firstSurname', 'primer_apellido', 'primerApellido', 'Primer Apellido', 'PRIMER_APELLIDO', 'first_surname'],
  secondSurname: ['secondSurname', 'segundo_apellido', 'segundoApellido', 'Segundo Apellido', 'SEGUNDO_APELLIDO', 'second_surname'],
  phone:         ['phone', 'Phone', 'telefono', 'teléfono', 'Telefono', 'Teléfono', 'TELEFONO'],
  email:         ['email', 'Email', 'EMAIL', 'correo', 'Correo'],
  birthDate:     ['birthDate', 'birth_date', 'fechaNacimiento', 'fecha_nacimiento', 'FechaNacimiento', 'fecha nacimiento'],
  city:          ['city', 'City', 'ciudad', 'Ciudad', 'CIUDAD'],
  neighborhood:  ['neighborhood', 'barrio', 'Barrio', 'BARRIO'],
  address:       ['address', 'Address', 'direccion', 'dirección', 'Direccion', 'Dirección', 'DIRECCION'],
  description:   ['description', 'Description', 'descripcion', 'descripción', 'Descripcion'],
};

function resolveCol(row: RawRow, field: string): string | number | null | undefined {
  const aliases = COLUMN_ALIASES[field] ?? [field];
  for (const alias of aliases) {
    if (alias in row) return row[alias];
  }
  return undefined;
}

function parseRow(row: RawRow, index: number): CreateServiceUserDto {
  // Domain rule: every persisted user string is uppercase + trimmed.
  const id = String(resolveCol(row, 'id') ?? '').trim();
  const firstName = String(resolveCol(row, 'firstName') ?? '').trim().toUpperCase();
  const firstSurname = String(resolveCol(row, 'firstSurname') ?? '').trim().toUpperCase();
  const phone = String(resolveCol(row, 'phone') ?? '').trim();

  if (!id) throw new BadRequestException(`Fila ${index + 2}: la cédula es requerida.`);
  if (!/^\d+$/.test(id)) throw new BadRequestException(`Fila ${index + 2}: la cédula solo debe contener dígitos.`);
  if (!firstName) throw new BadRequestException(`Fila ${index + 2}: el primer nombre es requerido.`);
  if (!firstSurname) throw new BadRequestException(`Fila ${index + 2}: el primer apellido es requerido.`);
  if (!/^\d{10}$/.test(phone)) throw new BadRequestException(`Fila ${index + 2}: el teléfono debe tener exactamente 10 dígitos.`);

  const emailRaw = resolveCol(row, 'email');
  const email = emailRaw != null && String(emailRaw).trim() !== '' ? String(emailRaw).trim().toUpperCase() : undefined;

  const birthDateRaw = resolveCol(row, 'birthDate');
  let birthDate: string | undefined;
  if (birthDateRaw != null && String(birthDateRaw).trim() !== '') {
    const raw = String(birthDateRaw).trim();
    const asDate = new Date(raw);
    birthDate = !isNaN(asDate.getTime()) ? asDate.toISOString() : undefined;
  }

  const upperStr = (field: string) => {
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

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListServiceUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const term = dto.search?.trim();

    const where: {
      isActive?: boolean;
      city?: { contains: string; mode: 'insensitive' };
      OR?: Array<{
        id?: { contains: string; mode: 'insensitive' };
        firstName?: { contains: string; mode: 'insensitive' };
        secondName?: { contains: string; mode: 'insensitive' };
        firstSurname?: { contains: string; mode: 'insensitive' };
        secondSurname?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (dto.isActive !== undefined) where.isActive = dto.isActive;
    if (dto.city) where.city = { contains: dto.city, mode: 'insensitive' };
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

  async findOne(id: string) {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Usuario no encontrado');
    return record;
  }

  async findOneOrNull(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateServiceUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { id: dto.id } });
    if (exists) throw new ConflictException(`La cédula ${dto.id} ya está registrada`);

    return this.prisma.user.create({
      data: {
        id: dto.id,
        firstName: dto.firstName,
        secondName: dto.secondName,
        firstSurname: dto.firstSurname,
        secondSurname: dto.secondSurname,
        phone: dto.phone,
        email: dto.email,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        birthDateApproximate: dto.birthDateApproximate ?? false,
        healthcareRegime: dto.healthcareRegime ?? null,
        city: dto.city,
        neighborhood: dto.neighborhood,
        address: dto.address,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateServiceUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.secondName !== undefined && { secondName: dto.secondName }),
        ...(dto.firstSurname !== undefined && { firstSurname: dto.firstSurname }),
        ...(dto.secondSurname !== undefined && { secondSurname: dto.secondSurname }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.birthDate !== undefined && { birthDate: dto.birthDate ? new Date(dto.birthDate) : null }),
        ...(dto.birthDateApproximate !== undefined && { birthDateApproximate: dto.birthDateApproximate }),
        ...(dto.healthcareRegime !== undefined && { healthcareRegime: dto.healthcareRegime }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.neighborhood !== undefined && { neighborhood: dto.neighborhood }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async bulkImport(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se proporcionó ningún archivo.');

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(ext ?? '')) {
      throw new BadRequestException('Solo se aceptan archivos .xlsx o .xls.');
    }

    let workbook: xlsx.WorkBook;
    try {
      workbook = xlsx.read(file.buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('El archivo no pudo ser leído. Verifique que sea un Excel válido.');
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new BadRequestException('El archivo no contiene ninguna hoja de datos.');

    const rows = xlsx.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], { defval: null });
    if (rows.length === 0) throw new BadRequestException('El archivo está vacío.');

    const parsed = rows.map((row, i) => parseRow(row, i));

    const inFileIds = parsed.map((r) => r.id);
    const inFileDuplicates = inFileIds.filter((id, i) => inFileIds.indexOf(id) !== i);
    if (inFileDuplicates.length > 0) {
      const unique = [...new Set(inFileDuplicates)];
      throw new BadRequestException({
        message: 'El archivo contiene cédulas duplicadas entre filas',
        duplicates: unique,
      });
    }

    const existing = await this.prisma.user.findMany({
      where: { id: { in: inFileIds } },
      select: { id: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException({
        message: 'Las siguientes cédulas ya están registradas en el sistema',
        duplicates: existing.map((r) => r.id),
      });
    }

    await this.prisma.$transaction(
      parsed.map((u) =>
        this.prisma.user.create({
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
        }),
      ),
    );

    return { inserted: parsed.length };
  }

  getTemplate(): Buffer {
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
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
