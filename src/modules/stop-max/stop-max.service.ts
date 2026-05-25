import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeCum } from '../../common/utils/normalize-cum';
import { CreateStopMaxDto } from './dto/create-stop-max.dto';
import { UpdateStopMaxDto } from './dto/update-stop-max.dto';
import { ListStopMaxDto } from './dto/list-stop-max.dto';

interface RawRow {
  [key: string]: string | number | null | undefined;
}

const COLUMN_ALIASES: Record<string, string[]> = {
  product: ['product', 'Product', 'PRODUCT', 'producto', 'PRODUCTO', 'nombre', 'NOMBRE', 'Nombre'],
  cum:     ['cum', 'CUM', 'Cum'],
  price:   ['price', 'Price', 'PRICE', 'precio', 'PRECIO', 'Precio'],
};

function resolveCol(row: RawRow, field: string): string | number | null | undefined {
  const aliases = COLUMN_ALIASES[field] ?? [field];
  for (const alias of aliases) {
    if (alias in row) return row[alias];
  }
  return undefined;
}

function parseRow(row: RawRow, index: number): CreateStopMaxDto {
  const product = String(resolveCol(row, 'product') ?? '').trim();
  const cumRaw  = resolveCol(row, 'cum');
  const priceRaw = resolveCol(row, 'price');

  if (!product) throw new BadRequestException(`Fila ${index + 2}: el campo 'product' es requerido.`);

  const cum = normalizeCum(cumRaw !== undefined && cumRaw !== null ? String(cumRaw) : null);

  const price = priceRaw !== undefined
    ? Math.max(0, parseInt(String(priceRaw), 10) || 0)
    : 0;

  return { product, cum, price };
}

@Injectable()
export class StopMaxService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListStopMaxDto) {
    const page  = dto.page  ?? 1;
    const limit = dto.limit ?? 20;
    const skip  = (page - 1) * limit;

    const where: {
      OR?: Array<{
        product?: { contains: string; mode: 'insensitive' };
        cum?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (dto.search) {
      where.OR = [
        { product: { contains: dto.search, mode: 'insensitive' } },
        { cum:     { contains: dto.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.stopMax.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
      this.prisma.stopMax.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const record = await this.prisma.stopMax.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tope máximo con id ${id} no encontrado.`);
    return record;
  }

  async create(dto: CreateStopMaxDto) {
    return this.prisma.stopMax.create({ data: { ...dto, cum: normalizeCum(dto.cum) } });
  }

  async update(id: number, dto: UpdateStopMaxDto) {
    await this.findOne(id);
    return this.prisma.stopMax.update({
      where: { id },
      data: { ...dto, ...(dto.cum !== undefined && { cum: normalizeCum(dto.cum) }) },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.stopMax.delete({ where: { id } });
  }

  async bulkUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se proporcionó ningún archivo.');

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      throw new BadRequestException('Solo se aceptan archivos .xlsx, .xls o .csv.');
    }

    let workbook: xlsx.WorkBook;
    try {
      workbook = xlsx.read(file.buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('El archivo no pudo ser leído. Verifique que sea un Excel o CSV válido.');
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new BadRequestException('El archivo no contiene ninguna hoja de datos.');

    const rows = xlsx.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], { defval: null });
    if (rows.length === 0) throw new BadRequestException('El archivo está vacío.');

    const records = rows.map((row, i) => parseRow(row, i));

    await this.prisma.$transaction([
      this.prisma.stopMax.deleteMany(),
      this.prisma.stopMax.createMany({ data: records }),
    ]);

    return { inserted: records.length, total: records.length };
  }

  getTemplate(): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      ['product', 'cum', 'price'],
      ['Paracetamol 500mg', '20161254-1', 15000],
      ['Ibuprofeno 400mg', '20180032-1', 12500],
    ]);
    ws['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 10 }];
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Topes');
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
