import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as xlsx from 'xlsx'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTvDataDto } from './dto/create-tv-data.dto'
import { UpdateTvDataDto } from './dto/update-tv-data.dto'
import { ListTvDataDto } from './dto/list-tv-data.dto'

interface RawRow {
  [key: string]: string | number | null | undefined
}

@Injectable()
export class TvDataService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListTvDataDto) {
    const page  = dto.page  ?? 1
    const limit = dto.limit ?? 20
    const skip  = (page - 1) * limit

    const where: {
      OR?: Array<{
        code?: { contains: string; mode: 'insensitive' }
        name?: { contains: string; mode: 'insensitive' }
        inventoryCode?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (dto.search) {
      where.OR = [
        { code: { contains: dto.search, mode: 'insensitive' } },
        { name: { contains: dto.search, mode: 'insensitive' } },
        { inventoryCode: { contains: dto.search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tvData.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
      this.prisma.tvData.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const record = await this.prisma.tvData.findUnique({ where: { id } })
    if (!record) throw new NotFoundException(`TvData con id ${id} no encontrado.`)
    return record
  }

  async create(dto: CreateTvDataDto) {
    return this.prisma.tvData.create({ data: dto })
  }

  async update(id: number, dto: UpdateTvDataDto) {
    await this.findOne(id)
    return this.prisma.tvData.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.tvData.delete({ where: { id } })
  }

  async bulkUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se proporcionó ningún archivo.')

    const ext = file.originalname.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      throw new BadRequestException('Solo se aceptan archivos .xlsx, .xls o .csv.')
    }

    let workbook: xlsx.WorkBook
    try {
      workbook = xlsx.read(file.buffer, { type: 'buffer' })
    } catch {
      throw new BadRequestException('El archivo no pudo ser leído. Verifique que sea un Excel o CSV válido.')
    }

    const sheetName = workbook.SheetNames[0]
    if (!sheetName) throw new BadRequestException('El archivo no contiene ninguna hoja de datos.')

    const rows = xlsx.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], { defval: null })
    if (rows.length === 0) throw new BadRequestException('El archivo está vacío.')

    const records = rows.map((row, i) => {
      const rowNumber = i + 2
      const code = String(row['code'] ?? '').trim()
      const name = String(row['name'] ?? '').trim()
      if (!code) throw new BadRequestException(`Fila ${rowNumber}: el campo 'code' es requerido.`)
      if (!name) throw new BadRequestException(`Fila ${rowNumber}: el campo 'name' es requerido.`)

      const rawInventoryCode = row['inventory_code']
      const inventoryCode =
        rawInventoryCode === null || rawInventoryCode === undefined
          ? null
          : String(rawInventoryCode).trim() || null

      const rawPrice = row['price']
      if (rawPrice === null || rawPrice === undefined || String(rawPrice).trim() === '') {
        throw new BadRequestException(`Fila ${rowNumber}: el campo 'price' es requerido.`)
      }
      const priceNum = Number(rawPrice)
      if (!Number.isInteger(priceNum) || priceNum < 0) {
        throw new BadRequestException(
          `Fila ${rowNumber}: el campo 'price' debe ser un entero ≥ 0 (sin decimales ni separadores).`,
        )
      }

      return { code, name, inventoryCode, price: priceNum }
    })

    await this.prisma.$transaction([
      this.prisma.tvData.deleteMany(),
      this.prisma.tvData.createMany({ data: records }),
    ])

    return { inserted: records.length, total: records.length }
  }

  getTemplate(): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      ['code', 'name', 'inventory_code', 'price'],
      ['TV001', 'Ejemplo TvData 1', 'INV-001', 12000],
      ['TV002', 'Ejemplo TvData 2', '', 8500],
    ])
    ws['!cols'] = [{ wch: 16 }, { wch: 40 }, { wch: 18 }, { wch: 12 }]
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'TvData')
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }
}
