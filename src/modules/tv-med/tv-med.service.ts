import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as xlsx from 'xlsx'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTvMedDto } from './dto/create-tv-med.dto'
import { UpdateTvMedDto } from './dto/update-tv-med.dto'
import { ListTvMedDto } from './dto/list-tv-med.dto'

interface RawRow {
  [key: string]: string | number | null | undefined
}

@Injectable()
export class TvMedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListTvMedDto) {
    const page  = dto.page  ?? 1
    const limit = dto.limit ?? 20
    const skip  = (page - 1) * limit

    const where: {
      OR?: Array<{
        code?: { contains: string; mode: 'insensitive' }
        name?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (dto.search) {
      where.OR = [
        { code: { contains: dto.search, mode: 'insensitive' } },
        { name: { contains: dto.search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tvMed.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
      this.prisma.tvMed.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const record = await this.prisma.tvMed.findUnique({ where: { id } })
    if (!record) throw new NotFoundException(`TvMed con id ${id} no encontrado.`)
    return record
  }

  async create(dto: CreateTvMedDto) {
    return this.prisma.tvMed.create({ data: dto })
  }

  async update(id: number, dto: UpdateTvMedDto) {
    await this.findOne(id)
    return this.prisma.tvMed.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.tvMed.delete({ where: { id } })
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
      const code = String(row['code'] ?? '').trim()
      const name = String(row['name'] ?? '').trim()
      if (!code) throw new BadRequestException(`Fila ${i + 2}: el campo 'code' es requerido.`)
      if (!name) throw new BadRequestException(`Fila ${i + 2}: el campo 'name' es requerido.`)
      return { code, name }
    })

    await this.prisma.$transaction([
      this.prisma.tvMed.deleteMany(),
      this.prisma.tvMed.createMany({ data: records }),
    ])

    return { inserted: records.length, total: records.length }
  }

  getTemplate(): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      ['code', 'name'],
      ['TV001', 'Ejemplo TvMed 1'],
      ['TV002', 'Ejemplo TvMed 2'],
    ])
    ws['!cols'] = [{ wch: 16 }, { wch: 40 }]
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'TvMed')
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }
}
