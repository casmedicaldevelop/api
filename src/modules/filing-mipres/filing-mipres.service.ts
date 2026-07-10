import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { DriveService, type DriveItem, type FolderNode } from '../drive/drive.service'
import { ListFilingMipresDto } from './dto/list-filing-mipres.dto'
import { RegisterDeliveryDto } from './dto/register-delivery.dto'
import { Workbook } from 'exceljs'

type FilingRow = Prisma.FilingMipresGetPayload<{}>

const DAY_MS = 24 * 60 * 60 * 1000

/** Inicio del día en hora Colombia (UTC-5, sin DST) para un YYYY-MM-DD. */
function colombiaDayStart(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00-05:00`)
}

/** Régimen de salud → código de exportación: CONTRIBUTIVO=1, SUBSIDIADO=4. */
function regimeCode(r: string | null | undefined): string {
  if (r === 'CONTRIBUTIVO') return '1'
  if (r === 'SUBSIDIADO') return '4'
  return ''
}

function isoDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : ''
}

/** Total de códigos de estantería antes de volver a empezar: A1..Z100 = 26 × 100. */
const SHELF_CODE_SLOTS = 26 * 100

/**
 * Código de estantería a partir del valor del contador (1 = primer asignado).
 * Orden tipo odómetro: el número corre primero. 1→A1, 100→A100, 101→B1,
 * 2600→Z100, 2601→A1 (vuelve a empezar).
 */
function shelfCodeFromValue(value: number): string {
  const slot = (value - 1) % SHELF_CODE_SLOTS
  const letter = String.fromCharCode(65 + Math.floor(slot / 100))
  const number = (slot % 100) + 1
  return `${letter}${number}`
}

/**
 * Columnas del Excel en el ORDEN DE LA TABLA filing_mipres. Donde está el
 * documento del doctor, enseguida van sus datos; donde está el documento del
 * usuario, enseguida van todos los datos del usuario. El resto en orden de tabla.
 */
const EXPORT_COLUMNS: Array<{ header: string; key: string }> = [
  // Fechas del radicado primero
  { header: 'Creado', key: 'createdAt' },
  { header: 'Actualizado', key: 'updatedAt' },
  // Doctor (documento + sus datos)
  { header: 'Documento Doctor', key: 'doctorDocument' },
  { header: 'Doctor Nombre', key: 'doctorName' },
  // Usuario (documento + todos sus datos)
  { header: 'Documento Usuario', key: 'userDocument' },
  { header: 'Tipo Doc Usuario', key: 'userDocumentType' },
  { header: 'Género', key: 'userGender' },
  { header: 'Primer Nombre', key: 'userFirstName' },
  { header: 'Segundo Nombre', key: 'userSecondName' },
  { header: 'Primer Apellido', key: 'userFirstSurname' },
  { header: 'Segundo Apellido', key: 'userSecondSurname' },
  { header: 'Teléfono', key: 'userPhone' },
  { header: 'Email', key: 'userEmail' },
  { header: 'F. Nacimiento', key: 'userBirthDate' },
  { header: 'Nacimiento Aprox.', key: 'userBirthDateApproximate' },
  { header: 'Régimen', key: 'userRegime' },
  { header: 'Ciudad', key: 'userCity' },
  { header: 'Barrio', key: 'userNeighborhood' },
  { header: 'Dirección', key: 'userAddress' },
  { header: 'Descripción Usuario', key: 'userDescription' },
  { header: 'Usuario Activo', key: 'userIsActive' },
  // Resto del radicado en orden de tabla
  { header: 'Prescripción', key: 'prescriptionNumber' },
  { header: 'ID Programación', key: 'scheduleId' },
  { header: 'ID Direccionamiento', key: 'routingId' },
  { header: 'ID Entrega', key: 'deliveryId' },
  { header: 'ID Reporte', key: 'deliveryReportId' },
  { header: 'ID Facturación', key: 'billingId' },
  { header: 'N° Factura', key: 'invoiceCode' },
  { header: 'F. Factura', key: 'invoiceDate' },
  { header: 'Cod. Tecnología', key: 'technologyCode' },
  { header: 'Cod. Inventario', key: 'inventoryCode' },
  { header: 'Medicamento', key: 'medicationName' },
  { header: 'Cant. a entregar', key: 'quantityToDeliver' },
  { header: 'Valor unitario', key: 'unitPrice' },
  { header: 'Valor total', key: 'totalPrice' },
  { header: 'F. Entrega', key: 'deliveryDate' },
  { header: 'F. Máx Entrega', key: 'maxDeliveryDate' },
  { header: 'Código Radicado', key: 'filingCode' },
  { header: 'CUFE', key: 'cufe' },
  { header: 'Estado', key: 'status' },
  { header: 'Subestado', key: 'substatus' },
  { header: 'Cant. pendiente', key: 'quantityPending' },
  { header: 'Cant. entregada', key: 'quantityDelivered' },
]

function serialize(row: FilingRow) {
  return {
    ...row,
    scheduleId: row.scheduleId.toString(),
    routingId: row.routingId?.toString() ?? null,
    deliveryId: row.deliveryId?.toString() ?? null,
    deliveryReportId: row.deliveryReportId?.toString() ?? null,
    billingId: row.billingId?.toString() ?? null,
  }
}

@Injectable()
export class FilingMipresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly drive: DriveService,
  ) {}

  /** WHERE compartido por el listado y la exportación (mismos filtros). */
  private filingWhere(dto: ListFilingMipresDto): Prisma.FilingMipresWhereInput {
    const where: Prisma.FilingMipresWhereInput = {}
    if (dto.filingCode)
      where.filingCode = { contains: dto.filingCode, mode: 'insensitive' }
    if (dto.userDocument)
      where.userDocument = { contains: dto.userDocument, mode: 'insensitive' }
    if (dto.prescriptionNumber)
      where.prescriptionNumber = { contains: dto.prescriptionNumber, mode: 'insensitive' }
    if (dto.status) where.status = dto.status
    if (dto.substatus) where.substatus = dto.substatus

    // Fecha: dateExact tiene prioridad; si no, se aplica el rango dateFrom/dateTo.
    if (dto.dateExact) {
      const start = colombiaDayStart(dto.dateExact)
      where.createdAt = { gte: start, lt: new Date(start.getTime() + DAY_MS) }
    } else if (dto.dateFrom || dto.dateTo) {
      where.createdAt = {}
      if (dto.dateFrom) where.createdAt.gte = colombiaDayStart(dto.dateFrom)
      if (dto.dateTo)
        where.createdAt.lt = new Date(colombiaDayStart(dto.dateTo).getTime() + DAY_MS)
    }
    return where
  }

  /**
   * Exporta a Excel TODOS los radicados que cumplen el filtro (sin paginar),
   * con todas las columnas del radicado + los datos del usuario. El régimen se
   * mapea a código (CONTRIBUTIVO=1, SUBSIDIADO=4).
   */
  async exportAll(dto: ListFilingMipresDto): Promise<Buffer> {
    const where = this.filingWhere(dto)
    const rows = await this.prisma.filingMipres.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    const userDocs = [...new Set(rows.map((r) => r.userDocument))]
    const doctorDocs = [...new Set(rows.map((r) => r.doctorDocument))]
    const [users, doctors] = await Promise.all([
      this.prisma.user.findMany({ where: { id: { in: userDocs } } }),
      this.prisma.doctor.findMany({ where: { id: { in: doctorDocs } } }),
    ])
    const userMap = new Map(users.map((u) => [u.id, u]))
    const doctorMap = new Map(doctors.map((d) => [d.id, d]))

    const wb = new Workbook()
    const ws = wb.addWorksheet('Registros')
    ws.columns = EXPORT_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }))

    // Encabezado con la identidad de la empresa: navy del logo + texto blanco.
    const NAVY = 'FF0E2E5A'
    const headerRow = ws.getRow(1)
    headerRow.height = 24
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
      cell.alignment = { vertical: 'middle', horizontal: 'left' }
    })
    ws.views = [{ state: 'frozen', ySplit: 1 }]
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EXPORT_COLUMNS.length } }

    for (const r of rows) {
      const u = userMap.get(r.userDocument)
      const d = doctorMap.get(r.doctorDocument)
      ws.addRow({
        // Doctor
        doctorDocument: r.doctorDocument,
        doctorName: d?.name ?? '',
        // Usuario
        userDocument: r.userDocument,
        userDocumentType: u?.documentType ?? '',
        userGender: u?.gender ?? '',
        userFirstName: u?.firstName ?? '',
        userSecondName: u?.secondName ?? '',
        userFirstSurname: u?.firstSurname ?? '',
        userSecondSurname: u?.secondSurname ?? '',
        userPhone: u?.phone ?? '',
        userEmail: u?.email ?? '',
        userBirthDate: isoDate(u?.birthDate ?? null),
        userBirthDateApproximate: u ? (u.birthDateApproximate ? 'Sí' : 'No') : '',
        userRegime: regimeCode(u?.healthcareRegime),
        userCity: u?.city ?? '',
        userNeighborhood: u?.neighborhood ?? '',
        userAddress: u?.address ?? '',
        userDescription: u?.description ?? '',
        userIsActive: u ? (u.isActive ? 'Sí' : 'No') : '',
        // Resto del radicado (orden de tabla)
        prescriptionNumber: r.prescriptionNumber,
        scheduleId: r.scheduleId.toString(),
        routingId: r.routingId?.toString() ?? '',
        deliveryId: r.deliveryId?.toString() ?? '',
        deliveryReportId: r.deliveryReportId?.toString() ?? '',
        billingId: r.billingId?.toString() ?? '',
        invoiceCode: r.invoiceCode ?? '',
        invoiceDate: isoDate(r.invoiceDate),
        technologyCode: r.technologyCode,
        inventoryCode: r.inventoryCode ?? '',
        medicationName: r.medicationName,
        quantityToDeliver: r.quantityToDeliver,
        unitPrice: r.unitPrice,
        totalPrice: r.totalPrice,
        deliveryDate: isoDate(r.deliveryDate),
        maxDeliveryDate: isoDate(r.maxDeliveryDate),
        filingCode: r.filingCode ?? '',
        cufe: r.cufe ?? '',
        status: r.status,
        substatus: r.substatus ?? '',
        quantityPending: r.quantityPending,
        quantityDelivered: r.quantityDelivered,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })
    }

    // Bordes finos en todo + filas alternadas (zebra) azul claro para legibilidad.
    const thin = { style: 'thin' as const, color: { argb: 'FFD9D9D9' } }
    ws.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = { top: thin, left: thin, bottom: thin, right: thin }
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle' }
          if (rowNumber % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAF1FA' } }
          }
        }
      })
    })

    return Buffer.from(await wb.xlsx.writeBuffer())
  }

  /**
   * schedule_id (IdProgramacion de SISPRO) que ya tienen al menos una entrega
   * registrada en delivery_mipres, para una prescripción. El frontend lo usa para
   * deshabilitar la anulación de una programación que ya tiene entregas (no se
   * puede anular en SISPRO una programación con entregas realizadas).
   * Devuelve los BigInt serializados a string para no perder precisión.
   */
  async scheduleIdsWithDeliveries(prescriptionNumber: string): Promise<string[]> {
    if (!prescriptionNumber) return []
    const rows = await this.prisma.deliveryMipres.findMany({
      where: { filing: { prescriptionNumber } },
      distinct: ['scheduleId'],
      select: { scheduleId: true },
    })
    return rows.map((r) => r.scheduleId.toString())
  }

  /**
   * Tras una entrega SISPRO exitosa, persiste la trazabilidad en el radicado cuyo
   * routing_id (IDDireccionamiento) coincide. Siempre existe exactamente un radicado
   * por direccionamiento, por eso updateMany afecta esa única fila.
   */
  async setDeliveryByRouting(routingId: bigint, deliveryId: bigint, deliveryDate: Date) {
    return this.prisma.filingMipres.updateMany({
      where: { routingId },
      data: { deliveryId, deliveryDate },
    })
  }

  /**
   * Total por entrega: para una prescripción, el total_price del radicado de cada
   * IDEntrega ya registrada (delivery_id no nulo). El frontend lo usa para precargar,
   * en solo lectura, el valor a reportar. delivery_id se serializa a string.
   */
  async deliveryTotalsByPrescription(
    prescriptionNumber: string,
  ): Promise<Array<{ deliveryId: string; totalPrice: number }>> {
    if (!prescriptionNumber) return []
    const rows = await this.prisma.filingMipres.findMany({
      where: { prescriptionNumber, deliveryId: { not: null } },
      select: { deliveryId: true, totalPrice: true },
    })
    return rows
      .filter((r) => r.deliveryId !== null)
      .map((r) => ({ deliveryId: r.deliveryId!.toString(), totalPrice: r.totalPrice }))
  }

  /**
   * Tras un reporte de entrega exitoso, persiste delivery_report_id en el radicado
   * cuyo delivery_id (IDEntrega) coincide.
   */
  async setDeliveryReportByDelivery(deliveryId: bigint, deliveryReportId: bigint) {
    return this.prisma.filingMipres.updateMany({
      where: { deliveryId },
      data: { deliveryReportId },
    })
  }

  /**
   * Precarga de facturación: para una prescripción, por cada radicado ya reportado
   * (delivery_report_id no nulo) devuelve su routing_id (idDireccionamiento) y
   * unit_price (valor unitario). El frontend lo usa para ocultar esos inputs.
   * delivery_report_id y routing_id se serializan a string.
   */
  async facturacionPrefillByPrescription(
    prescriptionNumber: string,
  ): Promise<Array<{ deliveryReportId: string; routingId: string | null; unitPrice: number }>> {
    if (!prescriptionNumber) return []
    const rows = await this.prisma.filingMipres.findMany({
      where: { prescriptionNumber, deliveryReportId: { not: null } },
      select: { deliveryReportId: true, routingId: true, unitPrice: true },
    })
    return rows
      .filter((r) => r.deliveryReportId !== null)
      .map((r) => ({
        deliveryReportId: r.deliveryReportId!.toString(),
        routingId: r.routingId?.toString() ?? null,
        unitPrice: r.unitPrice,
      }))
  }

  /**
   * Tras una facturación exitosa, persiste en el radicado cuyo delivery_report_id
   * (IDReporteEntrega) coincide: billing_id ← IDFacturacion, invoice_code ← NoFactura.
   */
  async setBillingByDeliveryReport(
    deliveryReportId: bigint,
    billingId: bigint,
    invoiceCode: string,
  ) {
    return this.prisma.filingMipres.updateMany({
      where: { deliveryReportId },
      data: { billingId, invoiceCode },
    })
  }

  /**
   * Persiste un radicado tras un amarre exitoso en SISPRO. Se invoca solo
   * cuando `PUT /api/Programacion` respondió correctamente y trae un
   * `IdProgramacion` válido (ver MipresService.createSchedule). Deriva
   * totalPrice/quantityPending/quantityDelivered; el estado inicial es
   * PENDIENTE (recién amarrado, sin entrega).
   */
  async createFromBinding(data: {
    doctorDocument: string
    userDocument: string
    prescriptionNumber: string
    scheduleId: bigint
    routingId: bigint
    technologyCode: string
    inventoryCode: string | null
    medicationName: string
    quantityToDeliver: number
    unitPrice: number
    maxDeliveryDate: Date
  }) {
    try {
      const row = await this.prisma.filingMipres.create({
        data: {
          doctorDocument: data.doctorDocument,
          userDocument: data.userDocument,
          prescriptionNumber: data.prescriptionNumber,
          scheduleId: data.scheduleId,
          routingId: data.routingId,
          technologyCode: data.technologyCode,
          inventoryCode: data.inventoryCode,
          medicationName: data.medicationName,
          quantityToDeliver: data.quantityToDeliver,
          unitPrice: data.unitPrice,
          totalPrice: data.unitPrice * data.quantityToDeliver,
          maxDeliveryDate: data.maxDeliveryDate,
          status: 'PENDIENTE',
          quantityPending: data.quantityToDeliver,
          quantityDelivered: 0,
        },
      })
      return serialize(row)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un radicado para este usuario y programación',
        )
      }
      throw err
    }
  }

  /** Borra el filing de un amarre anulado (por IdProgramacion = schedule_id). Idempotente. */
  async deleteBySchedule(scheduleId: bigint) {
    return this.prisma.filingMipres.deleteMany({ where: { scheduleId } })
  }

  /**
   * Detalle completo de un radicado: todos los campos + lookups a paciente
   * (User), médico (Doctor), medicamento (TvData) y labels de estado/subestado.
   */
  /**
   * Cierre de radicación: persiste invoice_date (F. Factura), cufe y filing_code
   * (Radicado). Se invoca desde la pantalla de detalle cuando las etapas previas
   * están completas. Devuelve el detalle actualizado.
   */
  async updateRadicacion(
    id: number,
    dto: { invoiceDate: string; cufe: string; filingCode: string },
  ) {
    const exists = await this.prisma.filingMipres.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!exists) throw new NotFoundException(`Radicado con id ${id} no encontrado`)
    await this.prisma.filingMipres.update({
      where: { id },
      data: {
        invoiceDate: colombiaDayStart(dto.invoiceDate),
        cufe: dto.cufe,
        filingCode: dto.filingCode,
      },
    })
    return this.findOne(id)
  }

  /**
   * Devuelve el código de estantería del radicado. Si aún no tiene, le asigna
   * el siguiente del contador global rotativo (A1..Z100, luego A1) y lo guarda.
   * Reimpresiones del mismo radicado reusan el mismo código (no avanza el contador).
   */
  async assignShelfCode(id: number): Promise<{ shelfCode: string }> {
    const existing = await this.prisma.filingMipres.findUnique({
      where: { id },
      select: { id: true, shelfCode: true },
    })
    if (!existing) throw new NotFoundException(`Radicado con id ${id} no encontrado`)
    if (existing.shelfCode) return { shelfCode: existing.shelfCode }

    // Toma el siguiente valor del contador (atómico a nivel de fila) y calcula el código.
    const counter = await this.prisma.shelfCodeCounter.upsert({
      where: { id: 1 },
      create: { id: 1, value: 1 },
      update: { value: { increment: 1 } },
    })
    const code = shelfCodeFromValue(counter.value)

    // Guarda solo si seguía sin código (protege de asignación concurrente del mismo radicado).
    const res = await this.prisma.filingMipres.updateMany({
      where: { id, shelfCode: null },
      data: { shelfCode: code },
    })
    if (res.count === 1) return { shelfCode: code }

    // Carrera: otro proceso ya lo asignó → devuelve el guardado.
    const reread = await this.prisma.filingMipres.findUnique({
      where: { id },
      select: { shelfCode: true },
    })
    return { shelfCode: reread?.shelfCode ?? code }
  }

  /**
   * Busca el radicado por schedule_id (IDProgramacion leído del código de barras)
   * y devuelve su id interno. 404 si no existe (lo usa el escáner del listado).
   */
  async findIdBySchedule(scheduleId: string): Promise<{ id: number }> {
    if (!/^\d+$/.test(scheduleId)) {
      throw new NotFoundException(`No existe radicado para el código ${scheduleId}`)
    }
    const row = await this.prisma.filingMipres.findFirst({
      where: { scheduleId: BigInt(scheduleId) },
      select: { id: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!row) throw new NotFoundException(`No existe radicado para el código ${scheduleId}`)
    return { id: row.id }
  }

  async findOne(id: number) {
    const row = await this.prisma.filingMipres.findUnique({ where: { id } })
    if (!row) throw new NotFoundException(`Radicado con id ${id} no encontrado`)

    const [user, doctor, tvData, statuses, substatuses] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: row.userDocument } }),
      this.prisma.doctor.findUnique({ where: { id: row.doctorDocument } }),
      this.prisma.tvData.findFirst({ where: { code: row.technologyCode } }),
      this.prisma.filingMipresStatus.findMany(),
      this.prisma.filingMipresSubstatus.findMany(),
    ])

    const statusLabel = new Map(statuses.map((s) => [s.code, s.label] as const))
    const substatusLabel = new Map(substatuses.map((s) => [s.code, s.label] as const))
    const label = (m: Map<string, string>, code: string | null) =>
      code ? (m.get(code) ?? code) : null

    return {
      ...serialize(row),
      statusLabel: label(statusLabel, row.status),
      substatusLabel: label(substatusLabel, row.substatus),
      patient: user
        ? {
            document: user.id,
            documentType: user.documentType,
            firstName: user.firstName,
            secondName: user.secondName,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            gender: user.gender,
            birthDate: user.birthDate,
            healthcareRegime: user.healthcareRegime,
            phone: user.phone,
            email: user.email,
            city: user.city,
            neighborhood: user.neighborhood,
            address: user.address,
          }
        : null,
      doctor: doctor ? { document: doctor.id, name: doctor.name } : null,
      tvData: tvData
        ? { code: tvData.code, name: tvData.name, inventoryCode: tvData.inventoryCode, price: tvData.price }
        : null,
    }
  }

  // ===== Gestor de archivos por radicado (directo contra Drive, sin tabla) =====

  /** Carga el filing y exige entrega completa (ENTREGADO); devuelve el id de la raíz FILING_MIPRES/{id}. */
  private async filesRootId(filingId: number): Promise<string> {
    const row = await this.prisma.filingMipres.findUnique({ where: { id: filingId } })
    if (!row) throw new NotFoundException(`Radicado con id ${filingId} no encontrado`)
    if (row.status !== 'ENTREGADO') {
      throw new ConflictException('Los archivos solo están disponibles cuando la entrega está completa.')
    }
    return this.drive.ensureRadicadoRoot(filingId)
  }

  /** Verifica que el elemento pertenece al árbol del radicado; si no, 403. */
  private async assertInTree(itemId: string, rootId: string): Promise<void> {
    if (!(await this.drive.isWithinTree(itemId, rootId))) {
      throw new ForbiddenException('El elemento no pertenece a este radicado.')
    }
  }

  /** Enriquece las carpetas con conteo de elementos y tamaño (suma de archivos inmediatos). */
  private async enrichFolders(items: DriveItem[]): Promise<DriveItem[]> {
    return Promise.all(
      items.map(async (it) => {
        if (!it.isFolder) return it
        const children = await this.drive.listChildren(it.id)
        const folderSizeBytes = children
          .filter((c) => !c.isFolder)
          .reduce((acc, c) => acc + (Number(c.size) || 0), 0)
        return { ...it, childCount: children.length, folderSizeBytes }
      }),
    )
  }

  /** Contenido de la raíz FILING_MIPRES/{id} (la asegura si no existe). */
  async filesRoot(filingId: number) {
    const rootId = await this.filesRootId(filingId)
    const [rawItems, path] = await Promise.all([
      this.drive.listChildren(rootId),
      this.drive.pathTo(rootId, rootId),
    ])
    const items = await this.enrichFolders(rawItems)
    return { rootId, folderId: rootId, path, items }
  }

  /** Barrido completo del árbol de carpetas del radicado (una sola vez, para el panel de navegación). */
  async filesTree(filingId: number): Promise<{ rootId: string; tree: FolderNode[] }> {
    const rootId = await this.filesRootId(filingId)
    const tree = await this.drive.listFolderTree(rootId)
    return { rootId, tree }
  }

  /** Contenido de una subcarpeta (validada dentro del árbol). */
  async filesList(filingId: number, folderId: string) {
    const rootId = await this.filesRootId(filingId)
    await this.assertInTree(folderId, rootId)
    const [rawItems, path] = await Promise.all([
      this.drive.listChildren(folderId),
      this.drive.pathTo(folderId, rootId),
    ])
    const items = await this.enrichFolders(rawItems)
    return { rootId, folderId, path, items }
  }

  /** Crea una subcarpeta en folderId. */
  async filesCreateFolder(filingId: number, folderId: string, name: string): Promise<DriveItem> {
    const clean = (name ?? '').trim()
    if (!clean) throw new BadRequestException('El nombre de la carpeta es obligatorio.')
    const rootId = await this.filesRootId(filingId)
    await this.assertInTree(folderId, rootId)
    return this.drive.createFolder(folderId, clean)
  }

  /** Sube un archivo a folderId. */
  async filesUpload(
    filingId: number,
    folderId: string,
    file: { originalname: string; mimetype: string; buffer: Buffer } | undefined,
  ): Promise<DriveItem> {
    if (!file) throw new BadRequestException('No se recibió ningún archivo.')
    const rootId = await this.filesRootId(filingId)
    await this.assertInTree(folderId, rootId)
    return this.drive.uploadToFolder(folderId, file.buffer, file.originalname, file.mimetype)
  }

  /** Elimina un archivo o carpeta (no permite borrar la raíz del radicado). */
  async filesDelete(filingId: number, itemId: string): Promise<{ ok: true }> {
    const rootId = await this.filesRootId(filingId)
    if (itemId === rootId) {
      throw new BadRequestException('No se puede eliminar la carpeta raíz del radicado.')
    }
    await this.assertInTree(itemId, rootId)
    await this.drive.deleteItem(itemId)
    return { ok: true }
  }

  /** Stream de bytes para previsualizar/descargar. */
  async filesContent(filingId: number, itemId: string) {
    const rootId = await this.filesRootId(filingId)
    await this.assertInTree(itemId, rootId)
    return this.drive.getStream(itemId)
  }

  async findAll(dto: ListFilingMipresDto) {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 20
    const skip = (page - 1) * limit

    const where = this.filingWhere(dto)

    const [rows, total, byStatus, totalAgg, filingAgg] = await this.prisma.$transaction([
      this.prisma.filingMipres.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.filingMipres.count({ where }),
      // Conteos por estado y montos sobre TODO el conjunto filtrado (no la página).
      this.prisma.filingMipres.groupBy({
        by: ['status'],
        where,
        orderBy: { status: 'asc' },
        _count: true,
      }),
      this.prisma.filingMipres.aggregate({ where, _sum: { totalPrice: true } }),
      this.prisma.filingMipres.aggregate({
        where: { ...where, filingCode: { not: null } },
        _sum: { totalPrice: true },
        _count: true,
      }),
    ])

    const statusCount = (status: string) =>
      byStatus.find((g) => g.status === status)?._count ?? 0
    const totalAmount = totalAgg._sum.totalPrice ?? 0
    const filingAmount = filingAgg._sum.totalPrice ?? 0
    const filingCount = filingAgg._count ?? 0

    return {
      data: rows.map(serialize),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        total,
        pendiente: statusCount('PENDIENTE'),
        entregado: statusCount('ENTREGADO'),
        parcial: statusCount('ENTREGA_PARCIAL'),
        totalAmount,
        filingAmount,
        faltaAmount: totalAmount - filingAmount,
        // Conteos (afectados por los filtros, igual que los montos).
        filingCount,
        faltaCount: total - filingCount,
      },
    }
  }

  /**
   * Registra una entrega del medicamento (local). Tres casos:
   *  - COMPLETA: entrega todo el pendiente → filing ENTREGADO.
   *  - PARCIAL: entrega una parte → filing ENTREGA_PARCIAL · POR_PEDIR + pedido por el faltante.
   *  - SIN_EXISTENCIAS: no entrega nada → filing sigue PENDIENTE · POR_PEDIR + pedido por todo.
   * Crea el registro de entrega (salvo SIN_EXISTENCIAS) y, si queda algo por pedir, el registro
   * de pedido (order_mipres). `employeeId` viene del JWT.
   * (El descuento de inventario en `products` es fase aparte; aquí no se toca.)
   */
  async registerDelivery(filingId: number, dto: RegisterDeliveryDto, employeeId: string) {
    const filing = await this.prisma.filingMipres.findUnique({ where: { id: filingId } })
    if (!filing) throw new NotFoundException(`Radicado con id ${filingId} no encontrado`)
    if (filing.quantityPending <= 0)
      throw new BadRequestException('Este medicamento ya fue entregado por completo')

    // "Sin existencias" (estado Pendiente, nada entregado) solo aplica en la primera entrega.
    // Si ya hubo una entrega previa, el filing está en ENTREGA_PARCIAL y no puede volver a Pendiente.
    if (dto.deliveryType === 'SIN_EXISTENCIAS' && filing.quantityDelivered > 0)
      throw new BadRequestException(
        'No se puede marcar "Sin existencias": ya existe una entrega registrada para este medicamento',
      )

    const pending = filing.quantityPending

    let delivered: number
    if (dto.deliveryType === 'COMPLETA') {
      delivered = pending
    } else if (dto.deliveryType === 'PARCIAL') {
      delivered = dto.quantity ?? 0
      if (delivered < 1 || delivered >= pending)
        throw new BadRequestException(
          `La cantidad parcial debe estar entre 1 y ${pending - 1}`,
        )
    } else {
      delivered = 0 // SIN_EXISTENCIAS
    }

    const pendingAfter = pending - delivered
    const newStatus =
      dto.deliveryType === 'COMPLETA'
        ? 'ENTREGADO'
        : dto.deliveryType === 'PARCIAL'
          ? 'ENTREGA_PARCIAL'
          : 'PENDIENTE'
    const newSubstatus = dto.deliveryType === 'COMPLETA' ? 'ENTREGADO' : 'POR_PEDIR'

    return this.prisma.$transaction(async (tx) => {
      // Actualiza el filing (cantidades + estado/subestado).
      await tx.filingMipres.update({
        where: { id: filingId },
        data: {
          quantityDelivered: filing.quantityDelivered + delivered,
          quantityPending: pendingAfter,
          status: newStatus,
          substatus: newSubstatus,
        },
      })

      // Registro de entrega (solo si hubo entrega: COMPLETA o PARCIAL).
      if (dto.deliveryType !== 'SIN_EXISTENCIAS') {
        const count = await tx.deliveryMipres.count({ where: { filingId } })
        await tx.deliveryMipres.create({
          data: {
            filingId,
            deliveryNumber: count + 1,
            deliveryType: dto.deliveryType,
            quantityDelivered: delivered,
            quantityPendingAfter: pendingAfter,
            scheduleId: filing.scheduleId,
            routingId: filing.routingId ?? BigInt(0),
            employeeId,
            comment: dto.comment ?? null,
          },
        })
      }

      // Registro de pedido por lo que queda por pedir (PARCIAL o SIN_EXISTENCIAS).
      if (pendingAfter > 0) {
        await tx.orderMipres.create({
          data: {
            filingId,
            technologyCode: filing.technologyCode,
            inventoryCode: filing.inventoryCode,
            medicationName: filing.medicationName,
            quantity: pendingAfter,
            employeeId,
            scheduleId: filing.scheduleId,
            routingId: filing.routingId ?? BigInt(0),
            prescriptionNumber: filing.prescriptionNumber,
            status: 'POR_PEDIR',
            isActive: true,
          },
        })
      }

      return { ok: true, status: newStatus, substatus: newSubstatus, delivered, pendingAfter }
    })
  }

  /** Historial de entregas de un filing (cada entrega completa/parcial), con el nombre del empleado. */
  async listDeliveries(filingId: number) {
    const deliveries = await this.prisma.deliveryMipres.findMany({
      where: { filingId },
      orderBy: { deliveryNumber: 'asc' },
    })
    const employeeIds = [...new Set(deliveries.map((d) => d.employeeId))]
    const employees = employeeIds.length
      ? await this.prisma.employee.findMany({ where: { id: { in: employeeIds } } })
      : []
    const employeeName = new Map(employees.map((e) => [e.id, e.name] as const))

    return deliveries.map((d) => ({
      id: d.id,
      deliveryNumber: d.deliveryNumber,
      deliveryType: d.deliveryType,
      quantityDelivered: d.quantityDelivered,
      quantityPendingAfter: d.quantityPendingAfter,
      comment: d.comment,
      employeeId: d.employeeId,
      employeeName: employeeName.get(d.employeeId) ?? d.employeeId,
      createdAt: d.createdAt,
    }))
  }
}
