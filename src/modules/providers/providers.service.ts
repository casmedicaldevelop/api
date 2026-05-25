import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as xlsx from 'xlsx';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeCum } from '../../common/utils/normalize-cum';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ListProviderProductsDto } from './dto/list-provider-products.dto';
import { UpdateProviderProductDto } from './dto/update-provider-product.dto';

interface RawRow {
  [key: string]: string | number | null | undefined;
}

const COLUMN_ALIASES: Record<string, string[]> = {
  code:      ['code', 'Code', 'CODE', 'codigo', 'CODIGO', 'Codigo'],
  product:   ['product', 'Product', 'PRODUCT', 'producto', 'PRODUCTO', 'nombre', 'NOMBRE', 'Nombre'],
  iva:       ['iva', 'IVA', 'Iva'],
  cum:       ['cum', 'CUM', 'Cum'],
  priceBox:  ['price_box', 'priceBox', 'PriceBox', 'precio_caja', 'PrecioCaja'],
  priceUnit: ['price_unit', 'priceUnit', 'PriceUnit', 'precio_unidad', 'PrecioUnidad'],
  stopBox:   ['stop_box', 'stopBox', 'StopBox', 'paro_caja', 'ParoCaja'],
};

function resolveCol(row: RawRow, field: string): string | number | null | undefined {
  const aliases = COLUMN_ALIASES[field] ?? [field];
  for (const alias of aliases) {
    if (alias in row) return row[alias];
  }
  return undefined;
}

type ProviderProductDelegate = {
  findMany: (args: {
    where?: { code?: { contains: string; mode: 'insensitive' } | undefined; OR?: Array<{ code?: { contains: string; mode: 'insensitive' }; product?: { contains: string; mode: 'insensitive' }; cum?: { contains: string; mode: 'insensitive' } }> };
    skip?: number;
    take?: number;
    orderBy?: { code: 'asc' | 'desc' };
  }) => Promise<{ code: string; product: string; iva: boolean; cum: string | null; priceBox: number; priceUnit: number; stopBox: number }[]>;
  count: (args: {
    where?: { OR?: Array<{ code?: { contains: string; mode: 'insensitive' }; product?: { contains: string; mode: 'insensitive' }; cum?: { contains: string; mode: 'insensitive' } }> };
  }) => Promise<number>;
  findUnique: (args: { where: { code: string } }) => Promise<{ code: string; product: string; iva: boolean; cum: string | null; priceBox: number; priceUnit: number; stopBox: number } | null>;
  update: (args: { where: { code: string }; data: Partial<{ product: string; iva: boolean; cum: string | null; priceBox: number; priceUnit: number; stopBox: number }> }) => Promise<{ code: string; product: string; iva: boolean; cum: string | null; priceBox: number; priceUnit: number; stopBox: number }>;
  upsert: (args: { where: { code: string }; update: object; create: object }) => Promise<{ code: string }>;
  deleteMany: () => Promise<{ count: number }>;
  createMany: (args: { data: object[] }) => Promise<{ count: number }>;
};

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(providerId: number): ProviderProductDelegate {
    const map: Record<number, ProviderProductDelegate> = {
      1: this.prisma.provider1 as unknown as ProviderProductDelegate,
      2: this.prisma.provider2 as unknown as ProviderProductDelegate,
      3: this.prisma.provider3 as unknown as ProviderProductDelegate,
      4: this.prisma.provider4 as unknown as ProviderProductDelegate,
      5: this.prisma.provider5 as unknown as ProviderProductDelegate,
    };
    const delegate = map[providerId];
    if (!delegate) throw new NotFoundException(`Proveedor con ID ${providerId} no existe.`);
    return delegate;
  }

  async findAll() {
    return this.prisma.provider.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const provider = await this.prisma.provider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException(`Proveedor con ID ${id} no encontrado.`);
    return provider;
  }

  async update(id: number, dto: UpdateProviderDto) {
    await this.findOne(id);
    return this.prisma.provider.update({ where: { id }, data: dto });
  }

  async findProducts(providerId: number, dto: ListProviderProductsDto) {
    await this.findOne(providerId);
    const delegate = this.getDelegate(providerId);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Parameters<typeof delegate.findMany>[0]['where'] = {};

    if (dto.search) {
      where.OR = [
        { code: { contains: dto.search, mode: 'insensitive' } },
        { product: { contains: dto.search, mode: 'insensitive' } },
        { cum: { contains: dto.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      delegate.findMany({ where, skip, take: limit, orderBy: { code: 'asc' } }),
      delegate.count({ where: where.OR ? { OR: where.OR } : {} }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findProduct(providerId: number, code: string) {
    await this.findOne(providerId);
    const delegate = this.getDelegate(providerId);
    const product = await delegate.findUnique({ where: { code } });
    if (!product) throw new NotFoundException(`Producto '${code}' no encontrado en proveedor ${providerId}.`);
    return product;
  }

  async updateProduct(providerId: number, code: string, dto: UpdateProviderProductDto) {
    await this.findProduct(providerId, code);
    const delegate = this.getDelegate(providerId);
    return delegate.update({
      where: { code },
      data: { ...dto, ...(dto.cum !== undefined && { cum: normalizeCum(dto.cum) }) },
    });
  }

  async bulkUpload(providerId: number, file: Express.Multer.File, mode: 'upload' | 'update') {
    await this.findOne(providerId);
    const delegate = this.getDelegate(providerId);

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

    const products = rows.map((row, i) => {
      const code = String(resolveCol(row, 'code') ?? '').trim();
      const product = String(resolveCol(row, 'product') ?? '').trim();
      if (!code) throw new BadRequestException(`Fila ${i + 2}: el campo 'code' es requerido.`);
      if (!product) throw new BadRequestException(`Fila ${i + 2}: el campo 'product' es requerido.`);

      const ivaRaw = resolveCol(row, 'iva');
      const cumRaw = resolveCol(row, 'cum');

      let iva = false;
      if (ivaRaw !== undefined && ivaRaw !== null && String(ivaRaw).trim() !== '') {
        const ivaStr = String(ivaRaw).trim();
        if (ivaStr === 'SI') iva = true;
        else if (ivaStr === 'NO') iva = false;
        else throw new BadRequestException(`Fila ${i + 2}: el campo 'iva' debe ser 'SI' o 'NO' en mayúsculas.`);
      }

      const cum = normalizeCum(cumRaw !== undefined && cumRaw !== null ? String(cumRaw) : null);
      const priceBox = Math.max(0, parseFloat(String(resolveCol(row, 'priceBox') ?? '0')) || 0);
      const priceUnit = Math.max(0, parseFloat(String(resolveCol(row, 'priceUnit') ?? '0')) || 0);
      const stopBox = Math.max(0, parseFloat(String(resolveCol(row, 'stopBox') ?? '0')) || 0);

      return { code, product, iva, cum, priceBox, priceUnit, stopBox };
    });

    if (mode === 'upload') {
      const seenInFile = new Set<string>();
      const uniqueProducts = products.filter((p) => {
        const key = p.code.toLowerCase();
        if (seenInFile.has(key)) return false;
        seenInFile.add(key);
        return true;
      });

      await delegate.deleteMany();
      await delegate.createMany({ data: uniqueProducts });

      return {
        inserted: uniqueProducts.length,
        skipped: products.length - uniqueProducts.length,
        updated: 0,
        total: products.length,
        mode,
      };
    }

    let inserted = 0;
    let updated = 0;
    const chunkSize = 50;

    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      const existingCodes = new Set(
        (await delegate.findMany({ where: { OR: chunk.map((p) => ({ code: { contains: p.code, mode: 'insensitive' as const } })) } })).map((p) => p.code)
      );

      await Promise.all(
        chunk.map((p) =>
          delegate.upsert({
            where: { code: p.code },
            update: { product: p.product, iva: p.iva, cum: p.cum, priceBox: p.priceBox, priceUnit: p.priceUnit, stopBox: p.stopBox },
            create: { ...p },
          }),
        ),
      );

      chunk.forEach((p) => (existingCodes.has(p.code) ? updated++ : inserted++));
    }

    return { inserted, updated, total: products.length, mode };
  }

  getTemplate(providerName: string): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      ['code', 'product', 'iva', 'cum', 'price_box', 'price_unit', 'stop_box'],
      ['PROD-001', 'Paracetamol 500mg', 'SI', '20161254-1', 25000, 2500, 20000],
      ['PROD-002', 'Ibuprofeno 400mg', 'NO', '20180032-1', 18000, 1800, 15000],
    ]);
    ws['!cols'] = [
      { wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    ];
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, providerName);
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
