import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as xlsx from 'xlsx'
import { PrismaService } from '../../prisma/prisma.service'
import { normalizeCum } from '../../common/utils/normalize-cum'
import { CreateTvMedEventoDto } from './dto/create-tvmed-evento.dto'
import { UpdateTvMedEventoDto } from './dto/update-tvmed-evento.dto'
import { ListTvMedEventoDto } from './dto/list-tvmed-evento.dto'

interface RawRow {
  [key: string]: string | number | null | undefined
}

// Encabezados de las plantillas (en español, snake_case) ↔ campos internos.
const COLS = {
  cum: 'cum',
  name: 'nombre',
  value: 'valor',
  concentration: 'concentracion',
  presentation: 'presentacion',
  administrationRoute: 'via_administracion',
  shortName: 'diminutivo',
  measurementUnit: 'unidad_medida',
  pharmaceuticalForm: 'forma_farmaceutica',
  dispensingUnit: 'unidad_dispensacion',
} as const

// Lee una celda por nombre de columna en español (coincidencia exacta con el encabezado de la plantilla).
const cell = (row: RawRow, header: string): string | number | null | undefined => row[header]

type UpdateRowError = { row: number; column: string; reason: string }
type DirectUpdate = { row: number; cum: string; name: string; value: number; target: { id: number; name: string; value: number } }
type ConflictUpdate = {
  row: number; cum: string; name: string; value: number
  candidates: { id: number; name: string; value: number; concentration: string; presentation: string; shortName: string }[]
}
type MissingUpdate = { cum: string; name: string; value: number }

// Incluye los catálogos para que el front muestre la descripción (nombre), no el código.
const WITH_REFS = {
  measurementUnitRef: true,
  dispensingUnitRef: true,
  pharmaceuticalFormRef: true,
} satisfies Prisma.TvMedEventoInclude

@Injectable()
export class TvMedEventoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListTvMedEventoDto) {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 20
    const skip = (page - 1) * limit

    const where: Prisma.TvMedEventoWhereInput = {}
    const and: Prisma.TvMedEventoWhereInput[] = []
    const like = (v: string) => ({ contains: v, mode: 'insensitive' as const })
    if (dto.cum) and.push({ cum: like(dto.cum) })
    if (dto.name) and.push({ name: like(dto.name) })
    if (dto.isActive === 'true' || dto.isActive === 'false') and.push({ isActive: dto.isActive === 'true' })
    if (dto.concentration) and.push({ concentration: like(dto.concentration) })
    if (dto.presentation) and.push({ presentation: like(dto.presentation) })
    if (dto.administrationRoute) and.push({ administrationRoute: like(dto.administrationRoute) })
    if (dto.shortName) and.push({ shortName: like(dto.shortName) })
    if (dto.pharmaceuticalForm) and.push({ pharmaceuticalForm: dto.pharmaceuticalForm })
    if (dto.measurementUnit != null) and.push({ measurementUnit: dto.measurementUnit })
    if (dto.dispensingUnit != null) and.push({ dispensingUnit: dto.dispensingUnit })
    if (dto.valueMin != null || dto.valueMax != null) {
      and.push({ value: { gte: dto.valueMin ?? undefined, lte: dto.valueMax ?? undefined } })
    }
    if (and.length) where.AND = and

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tvMedEvento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: WITH_REFS,
      }),
      this.prisma.tvMedEvento.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const record = await this.prisma.tvMedEvento.findUnique({ where: { id }, include: WITH_REFS })
    if (!record) throw new NotFoundException(`Registro tvmed_evento con id ${id} no encontrado.`)
    return record
  }

  /** Devuelve todas las filas con ese cum EXACTO (indexado), con catálogos. */
  async findByCum(cum: string) {
    // Solo activos: si no está activo, no hace parte del contrato vigente.
    // El CUM se busca normalizado (sufijo 01-09 → 1-9), igual que se guarda.
    return this.prisma.tvMedEvento.findMany({
      where: { cum: normalizeCum(cum) ?? cum.trim(), isActive: true },
      orderBy: { id: 'asc' },
      include: WITH_REFS,
    })
  }

  /** Verifica que los códigos de unidad/forma existan en sus catálogos. */
  private async assertRefs(measurementUnit?: number, dispensingUnit?: number, pharmaceuticalForm?: string) {
    if (typeof measurementUnit === 'number') {
      const u = await this.prisma.scientificUnit.findUnique({ where: { code: measurementUnit } })
      if (!u) throw new BadRequestException(`La unidad de medida con código ${measurementUnit} no existe en el catálogo.`)
    }
    if (typeof dispensingUnit === 'number') {
      const u = await this.prisma.measurementUnit.findUnique({ where: { code: dispensingUnit } })
      if (!u) throw new BadRequestException(`La unidad de dispensación con código ${dispensingUnit} no existe en el catálogo.`)
    }
    if (pharmaceuticalForm !== undefined) {
      const f = await this.prisma.pharmaceuticalForm.findUnique({ where: { code: pharmaceuticalForm } })
      if (!f) throw new BadRequestException(`La forma farmacéutica con código ${pharmaceuticalForm} no existe en el catálogo.`)
    }
  }

  async create(dto: CreateTvMedEventoDto) {
    await this.assertRefs(dto.measurementUnit, dto.dispensingUnit, dto.pharmaceuticalForm)
    // El CUM se guarda normalizado (sufijo 01-09 → 1-9). Toda fila creada queda activa.
    return this.prisma.tvMedEvento.create({
      data: { ...dto, cum: normalizeCum(dto.cum) ?? dto.cum, isActive: true },
      include: WITH_REFS,
    })
  }

  async update(id: number, dto: UpdateTvMedEventoDto) {
    await this.findOne(id)
    await this.assertRefs(dto.measurementUnit, dto.dispensingUnit, dto.pharmaceuticalForm)
    return this.prisma.tvMedEvento.update({
      where: { id },
      data: { ...dto, ...(dto.cum !== undefined && { cum: normalizeCum(dto.cum) ?? dto.cum }) },
      include: WITH_REFS,
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.tvMedEvento.delete({ where: { id } })
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

    // Catálogos válidos para validar las referencias por código.
    const [scientificUnits, dispensingUnits, forms] = await Promise.all([
      this.prisma.scientificUnit.findMany({ select: { code: true } }),
      this.prisma.measurementUnit.findMany({ select: { code: true } }),
      this.prisma.pharmaceuticalForm.findMany({ select: { code: true } }),
    ])
    const validMeasurement = new Set(scientificUnits.map((u) => u.code))
    const validDispensing = new Set(dispensingUnits.map((u) => u.code))
    const validForms = new Set(forms.map((f) => f.code))

    // Acumula TODOS los errores (fila + columna + motivo) en vez de cortar en el primero.
    const errors: { row: number; column: string; reason: string }[] = []
    const getStr = (row: RawRow, header: string, rowNumber: number): string => {
      const v = cell(row, header)
      const s = v === null || v === undefined ? '' : String(v).trim()
      if (!s) errors.push({ row: rowNumber, column: header, reason: 'requerido (está vacío)' })
      return s
    }
    const getInt = (row: RawRow, header: string, rowNumber: number): number | null => {
      const v = cell(row, header)
      if (v === null || v === undefined || String(v).trim() === '') {
        errors.push({ row: rowNumber, column: header, reason: 'requerido (está vacío)' })
        return null
      }
      const n = Number(v)
      if (!Number.isInteger(n)) {
        errors.push({ row: rowNumber, column: header, reason: `debe ser un entero (recibido: "${String(v).trim()}")` })
        return null
      }
      return n
    }

    const records = rows.map((row, i) => {
      const rowNumber = i + 2
      const cumRaw = getStr(row, COLS.cum, rowNumber)
      const cum = normalizeCum(cumRaw) ?? cumRaw // CUM normalizado (sufijo 01-09 → 1-9)
      const name = getStr(row, COLS.name, rowNumber)
      const value = getInt(row, COLS.value, rowNumber)
      if (value !== null && value < 0) errors.push({ row: rowNumber, column: COLS.value, reason: 'debe ser ≥ 0' })
      const concentration = getStr(row, COLS.concentration, rowNumber)
      const presentation = getStr(row, COLS.presentation, rowNumber)
      const administrationRoute = getStr(row, COLS.administrationRoute, rowNumber)
      const shortName = getStr(row, COLS.shortName, rowNumber)
      const measurementUnit = getInt(row, COLS.measurementUnit, rowNumber)
      const pharmaceuticalForm = getStr(row, COLS.pharmaceuticalForm, rowNumber)
      const dispensingUnit = getInt(row, COLS.dispensingUnit, rowNumber)

      if (measurementUnit !== null && !validMeasurement.has(measurementUnit)) {
        errors.push({ row: rowNumber, column: COLS.measurementUnit, reason: `el código ${measurementUnit} no existe en el catálogo de unidades de medida` })
      }
      if (dispensingUnit !== null && !validDispensing.has(dispensingUnit)) {
        errors.push({ row: rowNumber, column: COLS.dispensingUnit, reason: `el código ${dispensingUnit} no existe en el catálogo de unidades de dispensación` })
      }
      if (pharmaceuticalForm && !validForms.has(pharmaceuticalForm)) {
        errors.push({ row: rowNumber, column: COLS.pharmaceuticalForm, reason: `el código ${pharmaceuticalForm} no existe en el catálogo de formas farmacéuticas` })
      }

      return {
        cum, name, value, concentration, presentation,
        administrationRoute, shortName, measurementUnit, pharmaceuticalForm, dispensingUnit,
      }
    })

    if (errors.length) {
      const MAX = 200
      throw new BadRequestException({
        message: `El archivo tiene ${errors.length} error(es). Corrige las filas indicadas y vuelve a subirlo.`,
        errors: errors.slice(0, MAX),
        truncated: errors.length > MAX ? errors.length - MAX : 0,
      })
    }

    const data = records.map((r) => ({
      ...r,
      value: r.value as number,
      measurementUnit: r.measurementUnit as number,
      dispensingUnit: r.dispensingUnit as number,
      isActive: true, // los faltantes cargados quedan activos para el contrato vigente
    }))

    // Inserción aditiva (NO reemplaza la tabla): solo agrega los faltantes del archivo.
    await this.prisma.tvMedEvento.createMany({ data })

    return { inserted: data.length, total: data.length }
  }

  getTemplate(): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      [COLS.cum, COLS.name, COLS.value, COLS.concentration, COLS.presentation, COLS.administrationRoute, COLS.shortName, COLS.measurementUnit, COLS.pharmaceuticalForm, COLS.dispensingUnit],
      ['20012345', 'Ejemplo medicamento', 12000, '500 mg', 'Caja x 10', 'Oral', 'EJ MED', 168, 'C42966', 11],
    ])
    ws['!cols'] = [
      { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 16 }, { wch: 18 },
      { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
    ]
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'tvmed_evento')
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }

  // ---- Actualización por Excel (solo el campo value, buscando por cum) ----

  /** Plantilla de entrada para la actualización: cum, nombre, valor. */
  getUpdateTemplate(): Buffer {
    const ws = xlsx.utils.aoa_to_sheet([
      [COLS.cum, COLS.name, COLS.value],
      ['20012345', 'Ejemplo medicamento', 12000],
    ])
    ws['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 10 }]
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'actualizacion')
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }

  /** Lee la primera hoja de un archivo subido (.xlsx/.xls/.csv) a filas crudas. */
  private readSheet(file: Express.Multer.File): RawRow[] {
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
    return rows
  }

  /** Analiza el archivo (cum, name, value) y clasifica cada fila; NO muta nada. */
  async previewUpdate(file: Express.Multer.File) {
    const rows = this.readSheet(file)
    const errors: UpdateRowError[] = []
    const parsed: { rowNumber: number; cum: string; name: string; value: number }[] = []

    rows.forEach((row, i) => {
      const rowNumber = i + 2
      const cumRaw = cell(row, COLS.cum)
      const cumTrim = cumRaw === null || cumRaw === undefined ? '' : String(cumRaw).trim()
      const cum = cumTrim ? normalizeCum(cumTrim) ?? cumTrim : '' // normalizado para matchear lo guardado
      if (!cum) errors.push({ row: rowNumber, column: COLS.cum, reason: 'requerido (está vacío)' })
      const nameRaw = cell(row, COLS.name)
      const name = nameRaw === null || nameRaw === undefined ? '' : String(nameRaw).trim()

      const vRaw = cell(row, COLS.value)
      let value: number | null = null
      if (vRaw === null || vRaw === undefined || String(vRaw).trim() === '') {
        errors.push({ row: rowNumber, column: COLS.value, reason: 'requerido (está vacío)' })
      } else {
        const n = Number(vRaw)
        if (!Number.isInteger(n)) errors.push({ row: rowNumber, column: COLS.value, reason: `debe ser un entero (recibido: "${String(vRaw).trim()}")` })
        else if (n < 0) errors.push({ row: rowNumber, column: COLS.value, reason: 'debe ser ≥ 0' })
        else value = n
      }

      if (cum && value !== null) parsed.push({ rowNumber, cum, name, value })
    })

    const cums = [...new Set(parsed.map((p) => p.cum))]
    const existing = cums.length
      ? await this.prisma.tvMedEvento.findMany({
          where: { cum: { in: cums } },
          select: { id: true, cum: true, name: true, value: true, concentration: true, presentation: true, shortName: true },
        })
      : []
    const byCum = new Map<string, typeof existing>()
    for (const r of existing) {
      const arr = byCum.get(r.cum) ?? []
      arr.push(r)
      byCum.set(r.cum, arr)
    }

    const directs: DirectUpdate[] = []
    const conflicts: ConflictUpdate[] = []
    const missing: MissingUpdate[] = []
    for (const p of parsed) {
      const matches = byCum.get(p.cum) ?? []
      if (matches.length === 0) {
        missing.push({ cum: p.cum, name: p.name, value: p.value })
      } else if (matches.length === 1) {
        directs.push({ row: p.rowNumber, cum: p.cum, name: p.name, value: p.value, target: { id: matches[0].id, name: matches[0].name, value: matches[0].value } })
      } else {
        conflicts.push({
          row: p.rowNumber, cum: p.cum, name: p.name, value: p.value,
          candidates: matches.map((m) => ({ id: m.id, name: m.name, value: m.value, concentration: m.concentration, presentation: m.presentation, shortName: m.shortName })),
        })
      }
    }

    return { directs, conflicts, missing, errors }
  }

  /** Aplica la actualización: cambia SOLO value de los ids indicados. */
  async applyUpdate(items: { id: number; value: number }[]) {
    if (!items?.length) return { updated: 0 }
    const ids = items.map((i) => i.id)
    const found = await this.prisma.tvMedEvento.findMany({ where: { id: { in: ids } }, select: { id: true } })
    const set = new Set(found.map((f) => f.id))
    for (const it of items) {
      if (!set.has(it.id)) throw new BadRequestException(`El registro con id ${it.id} no existe.`)
      if (!Number.isInteger(it.value) || it.value < 0) throw new BadRequestException(`Valor inválido para el id ${it.id}: debe ser un entero ≥ 0.`)
    }
    // Cada fila actualizada queda activa (aunque el valor sea el mismo).
    await this.prisma.$transaction(items.map((it) => this.prisma.tvMedEvento.update({ where: { id: it.id }, data: { value: it.value, isActive: true } })))
    return { updated: items.length }
  }

  /** Excel prellenado de los cum faltantes, con las 10 columnas de la carga masiva. */
  getMissingTemplate(rows: { cum: string; name: string; value: number }[]): Buffer {
    const header = [COLS.cum, COLS.name, COLS.value, COLS.concentration, COLS.presentation, COLS.administrationRoute, COLS.shortName, COLS.measurementUnit, COLS.pharmaceuticalForm, COLS.dispensingUnit]
    const body = (rows ?? []).map((r) => [r.cum, r.name, r.value, '', '', '', '', '', '', ''])
    const ws = xlsx.utils.aoa_to_sheet([header, ...body])
    ws['!cols'] = [
      { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 16 }, { wch: 18 },
      { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
    ]
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'tvmed_evento')
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }
}
