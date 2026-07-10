import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { PrismaService } from '../../prisma/prisma.service'
import { DriveService, type DriveItem, type FolderNode } from '../drive/drive.service'
import { CreateFilingEventDto } from './dto/create-filing-event.dto'
import { ListFilingEventDto } from './dto/list-filing-event.dto'
import { RegisterDeliveryEventDto } from './dto/register-delivery-event.dto'
import { parseAuthorizationPdf } from './lib/authorization-pdf.parser'

/** Una fila por medicamento/insumo: Fechas → Doctor → Usuario (todos) → datos del radicado/línea. */
const EVENT_EXPORT_COLUMNS: Array<{ header: string; key: string }> = [
  { header: 'Creado', key: 'createdAt' },
  // Doctor
  { header: 'Documento Doctor', key: 'doctorDocument' },
  { header: 'Doctor Nombre', key: 'doctorName' },
  // Usuario (todos los datos)
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
  { header: 'Régimen', key: 'userRegime' },
  { header: 'Ciudad', key: 'userCity' },
  { header: 'Barrio', key: 'userNeighborhood' },
  { header: 'Dirección', key: 'userAddress' },
  { header: 'Descripción Usuario', key: 'userDescription' },
  { header: 'Usuario Activo', key: 'userIsActive' },
  // Radicado + medicamento/insumo (una fila por línea)
  { header: 'Autorización', key: 'authorizationCode' },
  { header: 'Código Remitente', key: 'senderCode' },
  { header: 'Nombre Remitente', key: 'senderName' },
  { header: 'Diagnóstico', key: 'mainDiagnosis' },
  { header: 'Detalle Diagnóstico', key: 'diagnosisDetail' },
  { header: 'F. Prescripción', key: 'prescriptionDate' },
  { header: 'F. Autorización', key: 'authorizationDate' },
  { header: 'F. Solicitud', key: 'requestDate' },
  { header: 'CUM', key: 'cum' },
  { header: 'Nombre', key: 'name' },
  { header: 'Tipo de Servicio', key: 'serviceType' },
  { header: 'Concentración', key: 'concentration' },
  { header: 'Presentación', key: 'presentation' },
  { header: 'Vía de Administración', key: 'administrationRoute' },
  { header: 'Unidad de Medida', key: 'measurementUnitName' },
  { header: 'Forma Farmacéutica', key: 'pharmaceuticalFormName' },
  { header: 'Unidad de Dispensación', key: 'dispensingUnitName' },
  { header: 'Frecuencia por Día', key: 'frequencyPerDay' },
  { header: 'Duración Tratamiento', key: 'treatmentDuration' },
  { header: 'Cant. Prescrita', key: 'prescribedQuantity' },
  { header: 'Días Tratamiento', key: 'treatmentDays' },
  { header: 'Cant. a Entregar', key: 'quantity' },
  { header: 'Entregado', key: 'quantityDelivered' },
  { header: 'Pendiente', key: 'quantityPending' },
  { header: 'V. Unitario', key: 'unitValue' },
  { header: 'V. Total', key: 'totalValue' },
  { header: 'Estado', key: 'status' },
  { header: 'Subestado', key: 'substatus' },
  { header: 'Radicado', key: 'filingCode' },
]

const isoDate = (d: Date | null | undefined): string => (d ? d.toISOString().slice(0, 10) : '')

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

@Injectable()
export class FilingEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly drive: DriveService,
  ) {}

  // ===== Gestor de archivos por radicado de evento (Drive directo, carpeta por código de autorización) =====

  /** Carga el radicado y devuelve el id de la raíz FILING_EVENT/{códigoAutorización}. Siempre disponible. */
  private async filesRootId(eventId: number): Promise<string> {
    const row = await this.prisma.filingEvent.findUnique({
      where: { id: eventId },
      select: { authorizationCode: true },
    })
    if (!row) throw new NotFoundException(`Radicación de evento con id ${eventId} no encontrada.`)
    return this.drive.ensureEventRoot(row.authorizationCode)
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

  /** Contenido de la raíz FILING_EVENT/{códigoAutorización} (la asegura si no existe). */
  async filesRoot(eventId: number) {
    const rootId = await this.filesRootId(eventId)
    const [rawItems, path] = await Promise.all([
      this.drive.listChildren(rootId),
      this.drive.pathTo(rootId, rootId),
    ])
    const items = await this.enrichFolders(rawItems)
    return { rootId, folderId: rootId, path, items }
  }

  /** Barrido completo del árbol de carpetas del radicado (para el panel de navegación). */
  async filesTree(eventId: number): Promise<{ rootId: string; tree: FolderNode[] }> {
    const rootId = await this.filesRootId(eventId)
    const tree = await this.drive.listFolderTree(rootId)
    return { rootId, tree }
  }

  /** Contenido de una subcarpeta (validada dentro del árbol). */
  async filesList(eventId: number, folderId: string) {
    const rootId = await this.filesRootId(eventId)
    await this.assertInTree(folderId, rootId)
    const [rawItems, path] = await Promise.all([
      this.drive.listChildren(folderId),
      this.drive.pathTo(folderId, rootId),
    ])
    const items = await this.enrichFolders(rawItems)
    return { rootId, folderId, path, items }
  }

  /** Crea una subcarpeta en folderId. */
  async filesCreateFolder(eventId: number, folderId: string, name: string): Promise<DriveItem> {
    const clean = (name ?? '').trim()
    if (!clean) throw new BadRequestException('El nombre de la carpeta es obligatorio.')
    const rootId = await this.filesRootId(eventId)
    await this.assertInTree(folderId, rootId)
    return this.drive.createFolder(folderId, clean)
  }

  /** Sube un archivo a folderId. */
  async filesUpload(
    eventId: number,
    folderId: string,
    file: { originalname: string; mimetype: string; buffer: Buffer } | undefined,
  ): Promise<DriveItem> {
    if (!file) throw new BadRequestException('No se recibió ningún archivo.')
    const rootId = await this.filesRootId(eventId)
    await this.assertInTree(folderId, rootId)
    return this.drive.uploadToFolder(folderId, file.buffer, file.originalname, file.mimetype)
  }

  /** Elimina un archivo o carpeta (no permite borrar la raíz del radicado). */
  async filesDelete(eventId: number, itemId: string): Promise<{ ok: true }> {
    const rootId = await this.filesRootId(eventId)
    if (itemId === rootId) {
      throw new BadRequestException('No se puede eliminar la carpeta raíz del radicado.')
    }
    await this.assertInTree(itemId, rootId)
    await this.drive.deleteItem(itemId)
    return { ok: true }
  }

  /** Stream de bytes para previsualizar/descargar. */
  async filesContent(eventId: number, itemId: string) {
    const rootId = await this.filesRootId(eventId)
    await this.assertInTree(itemId, rootId)
    return this.drive.getStream(itemId)
  }

  /**
   * Recibe el PDF de la "Autorización de servicios" (JasperReports, plantilla fija) y devuelve toda
   * la información extraída como JSON. Extracción determinista por coordenadas (sin IA): ver
   * `parseAuthorizationPdf`. El shape de salida es el mismo que consume el wizard de registro.
   */
  async extractPdf(file: Express.Multer.File): Promise<{ data: unknown }> {
    if (!file) throw new BadRequestException('No se proporcionó ningún archivo.')
    const ext = file.originalname.split('.').pop()?.toLowerCase()
    if (ext !== 'pdf' && file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Solo se aceptan archivos PDF.')
    }

    try {
      return { data: await parseAuthorizationPdf(file.buffer) }
    } catch (err) {
      throw new BadRequestException((err as Error)?.message || 'No se pudo leer el PDF de autorización.')
    }
  }

  /** Crea la radicación de evento: cabecera (común) + N líneas (medicamentos/insumos). */
  async create(dto: CreateFilingEventDto) {
    const contract = await this.prisma.eventContract.findFirst({ where: { status: 'EN CURSO' } })
    if (!contract) throw new BadRequestException('No hay un contrato de evento EN CURSO.')

    const user = await this.prisma.user.findUnique({ where: { id: dto.userDocument } })
    const regime = user?.healthcareRegime ?? null // CONTRIBUTIVO / SUBSIDIADO
    if (regime !== 'CONTRIBUTIVO' && regime !== 'SUBSIDIADO') {
      throw new BadRequestException('El usuario no tiene un régimen válido (contributivo/subsidiado).')
    }

    // Valor total del radicado = sumatoria de (valor unitario × cantidad a entregar) de las líneas.
    const totalValue = dto.items.reduce((sum, it) => sum + it.unitValue * it.quantity, 0)

    // Cupo disponible del contrato para el régimen del usuario; no se puede superar el presupuesto.
    const available =
      regime === 'CONTRIBUTIVO'
        ? contract.contributoryValue - contract.consumedContributory
        : contract.subsidizedValue - contract.consumedSubsidized
    if (totalValue > available) {
      throw new BadRequestException(
        `El valor del radicado supera el cupo disponible del régimen ${regime}. Disponible: ${available}, requerido: ${totalValue}.`,
      )
    }

    // Diagnóstico global (lookup del detalle en diagnoses por código).
    const diag = await this.prisma.diagnosis.findUnique({ where: { code: dto.mainDiagnosis } })

    return this.prisma.$transaction(async (tx) => {
      const filing = await tx.filingEvent.create({
      data: {
        authorizationCode: dto.authorizationCode,
        senderCode: dto.senderCode,
        senderName: dto.senderName,
        doctorDocument: dto.doctorDocument,
        userDocument: dto.userDocument,
        userType: regime, // régimen del usuario (contributivo/subsidiado)
        prescriptionDate: new Date(dto.prescriptionDate),
        authorizationDate: new Date(dto.authorizationDate),
        requestDate: new Date(dto.requestDate),
        mainDiagnosis: dto.mainDiagnosis,
        diagnosisDetail: diag?.description ?? '',
        totalValue,
        status: 'PENDIENTE',
        contractId: contract.id,
        items: {
          create: dto.items.map((it) => ({
            cum: it.cum,
            name: it.name,
            serviceType: it.serviceType,
            quantity: it.quantity,
            unitValue: it.unitValue,
            totalValue: it.unitValue * it.quantity,
            concentration: it.concentration,
            presentation: it.presentation,
            administrationRoute: it.administrationRoute,
            shortName: it.shortName,
            measurementUnit: it.measurementUnit,
            pharmaceuticalForm: it.pharmaceuticalForm,
            dispensingUnit: it.dispensingUnit,
            frequencyPerDay: it.frequencyPerDay,
            treatmentDuration: it.treatmentDuration,
            prescribedQuantity: it.prescribedQuantity,
            treatmentDays: it.treatmentDays,
            status: 'PENDIENTE',
            quantityDelivered: 0,
            quantityPending: it.quantity,
          })),
        },
      },
      include: { items: true },
      })

      // Incrementa lo consumido del contrato para el régimen del usuario.
      await tx.eventContract.update({
        where: { id: contract.id },
        data: {
          consumedTotal: { increment: totalValue },
          ...(regime === 'CONTRIBUTIVO'
            ? { consumedContributory: { increment: totalValue } }
            : { consumedSubsidized: { increment: totalValue } }),
        },
      })

      return filing
    })
  }

  /**
   * `where` de las radicaciones del contrato: lo comparten list() y exportAll(), para que el Excel
   * exporte exactamente lo que la lista muestra filtrado.
   */
  private async filingWhere(
    contractId: number,
    query: ListFilingEventDto,
  ): Promise<Prisma.FilingEventWhereInput> {
    const where: Prisma.FilingEventWhereInput = { contractId }
    if (query.status) where.status = query.status
    if (query.userType) where.userType = query.userType
    if (query.userDocument?.trim()) where.userDocument = { contains: query.userDocument.trim(), mode: 'insensitive' }
    if (query.authorizationCode?.trim()) where.authorizationCode = { contains: query.authorizationCode.trim(), mode: 'insensitive' }
    // cum vive ahora en las líneas: filtra cabeceras que tengan al menos una línea con ese cum.
    if (query.cum?.trim()) where.items = { some: { cum: { contains: query.cum.trim(), mode: 'insensitive' } } }
    if (query.dateExact) {
      where.createdAt = { gte: new Date(`${query.dateExact}T00:00:00`), lte: new Date(`${query.dateExact}T23:59:59.999`) }
    } else if (query.dateFrom || query.dateTo) {
      where.createdAt = {
        ...(query.dateFrom && { gte: new Date(`${query.dateFrom}T00:00:00`) }),
        ...(query.dateTo && { lte: new Date(`${query.dateTo}T23:59:59.999`) }),
      }
    }

    // El nombre no vive en filing_event: se resuelven primero los documentos de los usuarios que
    // coinciden y se filtra por ellos. OR entre las 4 columnas del nombre, igual que users.service.
    const term = query.userName?.trim()
    if (term) {
      const matched = await this.prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { secondName: { contains: term, mode: 'insensitive' } },
            { firstSurname: { contains: term, mode: 'insensitive' } },
            { secondSurname: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
      })
      // Se compone con el filtro por documento (AND). Sin coincidencias → `in: []` → lista vacía.
      const docFilter = typeof where.userDocument === 'object' && where.userDocument !== null ? where.userDocument : {}
      where.userDocument = { ...docFilter, in: matched.map((u) => u.id) }
    }

    return where
  }

  /** Lista las radicaciones (cabeceras) del contrato EN CURSO (paginado, con conteos por estado general). */
  async list(query: ListFilingEventDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const contract = await this.prisma.eventContract.findFirst({ where: { status: 'EN CURSO' } })
    if (!contract) {
      return { data: [], total: 0, page, limit, totalPages: 0, counts: {} as Record<string, number> }
    }

    const where = await this.filingWhere(contract.id, query)

    const [data, total] = await this.prisma.$transaction([
      this.prisma.filingEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { _count: { select: { items: true } } },
      }),
      this.prisma.filingEvent.count({ where }),
    ])
    const grouped = await this.prisma.filingEvent.groupBy({
      by: ['status'],
      where: { contractId: contract.id },
      _count: true,
      orderBy: { status: 'asc' },
    })
    const counts: Record<string, number> = {}
    for (const g of grouped) counts[g.status] = g._count

    // Nombre completo del usuario de cada fila: UNA consulta por página, no una por radicación.
    const userDocuments = [...new Set(data.map((d) => d.userDocument))]
    const users = userDocuments.length
      ? await this.prisma.user.findMany({
          where: { id: { in: userDocuments } },
          select: { id: true, firstName: true, secondName: true, firstSurname: true, secondSurname: true },
        })
      : []
    const userNameById = new Map(
      users.map(
        (u) =>
          [u.id, [u.firstName, u.secondName, u.firstSurname, u.secondSurname].filter(Boolean).join(' ')] as const,
      ),
    )

    const rows = data.map((d) => ({
      id: d.id,
      createdAt: d.createdAt,
      authorizationCode: d.authorizationCode,
      prescriptionDate: d.prescriptionDate,
      authorizationDate: d.authorizationDate,
      requestDate: d.requestDate,
      userDocument: d.userDocument,
      userName: userNameById.get(d.userDocument) ?? '',
      userType: d.userType,
      totalValue: d.totalValue,
      status: d.status,
      itemsCount: d._count.items,
    }))

    return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit), counts }
  }

  /**
   * Exporta a Excel TODOS los registros del contrato EN CURSO que cumplen el filtro (sin paginar).
   * UNA FILA POR MEDICAMENTO/INSUMO (línea): un radicado con 6 ítems genera 6 filas.
   */
  async exportAll(query: ListFilingEventDto): Promise<Buffer> {
    const wb = new Workbook()
    const ws = wb.addWorksheet('Registros')
    ws.columns = EVENT_EXPORT_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }))

    const NAVY = 'FF0E2E5A'
    const headerRow = ws.getRow(1)
    headerRow.height = 24
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
      cell.alignment = { vertical: 'middle', horizontal: 'left' }
    })
    ws.views = [{ state: 'frozen', ySplit: 1 }]
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EVENT_EXPORT_COLUMNS.length } }

    const contract = await this.prisma.eventContract.findFirst({ where: { status: 'EN CURSO' } })
    if (contract) {
      const where = await this.filingWhere(contract.id, query)

      const filings = await this.prisma.filingEvent.findMany({
        where,
        orderBy: { id: 'desc' },
        include: { items: true },
      })

      const userDocs = [...new Set(filings.map((f) => f.userDocument))]
      const doctorDocs = [...new Set(filings.map((f) => f.doctorDocument))]
      const allItems = filings.flatMap((f) => f.items)
      const measCodes = [...new Set(allItems.map((i) => i.measurementUnit))]
      const dispCodes = [...new Set(allItems.map((i) => i.dispensingUnit))]
      const formCodes = [...new Set(allItems.map((i) => i.pharmaceuticalForm))]

      const [users, doctors, statuses, substatuses, sciUnits, measUnits, forms] = await Promise.all([
        this.prisma.user.findMany({ where: { id: { in: userDocs } } }),
        this.prisma.doctor.findMany({ where: { id: { in: doctorDocs } } }),
        this.prisma.filingEventStatus.findMany(),
        this.prisma.filingEventSubstatus.findMany(),
        this.prisma.scientificUnit.findMany({ where: { code: { in: measCodes } } }),
        this.prisma.measurementUnit.findMany({ where: { code: { in: dispCodes } } }),
        this.prisma.pharmaceuticalForm.findMany({ where: { code: { in: formCodes } } }),
      ])
      const userMap = new Map(users.map((u) => [u.id, u]))
      const doctorMap = new Map(doctors.map((d) => [d.id, d]))
      const statusLabel = new Map(statuses.map((s) => [s.code, s.label] as const))
      const substatusLabel = new Map(substatuses.map((s) => [s.code, s.label] as const))
      const sciName = new Map(sciUnits.map((u) => [u.code, u.name] as const))
      const dispDesc = new Map(measUnits.map((u) => [u.code, u.description] as const))
      const formDesc = new Map(forms.map((f) => [f.code, f.description] as const))

      for (const f of filings) {
        const u = userMap.get(f.userDocument)
        const d = doctorMap.get(f.doctorDocument)
        for (const it of f.items) {
          ws.addRow({
            createdAt: isoDate(f.createdAt),
            doctorDocument: f.doctorDocument,
            doctorName: d?.name ?? '',
            userDocument: f.userDocument,
            userDocumentType: u?.documentType ?? '',
            userGender: u?.gender ?? '',
            userFirstName: u?.firstName ?? '',
            userSecondName: u?.secondName ?? '',
            userFirstSurname: u?.firstSurname ?? '',
            userSecondSurname: u?.secondSurname ?? '',
            userPhone: u?.phone ?? '',
            userEmail: u?.email ?? '',
            userBirthDate: isoDate(u?.birthDate ?? null),
            userRegime: u?.healthcareRegime ?? '',
            userCity: u?.city ?? '',
            userNeighborhood: u?.neighborhood ?? '',
            userAddress: u?.address ?? '',
            userDescription: u?.description ?? '',
            userIsActive: u ? (u.isActive ? 'Sí' : 'No') : '',
            authorizationCode: f.authorizationCode,
            senderCode: f.senderCode ?? '',
            senderName: f.senderName ?? '',
            mainDiagnosis: f.mainDiagnosis ?? '',
            diagnosisDetail: f.diagnosisDetail ?? '',
            prescriptionDate: isoDate(f.prescriptionDate),
            authorizationDate: isoDate(f.authorizationDate),
            requestDate: isoDate(f.requestDate),
            cum: it.cum,
            name: it.name,
            serviceType: it.serviceType ?? '',
            concentration: it.concentration ?? '',
            presentation: it.presentation ?? '',
            administrationRoute: it.administrationRoute ?? '',
            measurementUnitName: sciName.get(it.measurementUnit) ?? '',
            pharmaceuticalFormName: formDesc.get(it.pharmaceuticalForm) ?? '',
            dispensingUnitName: dispDesc.get(it.dispensingUnit) ?? '',
            frequencyPerDay: it.frequencyPerDay,
            treatmentDuration: it.treatmentDuration,
            prescribedQuantity: it.prescribedQuantity,
            treatmentDays: it.treatmentDays,
            quantity: it.quantity,
            quantityDelivered: it.quantityDelivered,
            quantityPending: it.quantityPending,
            unitValue: it.unitValue,
            totalValue: it.totalValue,
            status: statusLabel.get(it.status) ?? it.status,
            substatus: it.substatus ? (substatusLabel.get(it.substatus) ?? it.substatus) : '',
            filingCode: f.filingCode ?? '',
          })
        }
      }
    }

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

  /** Devuelve { id } de la radicación con ese número de autorización (exacto), o null si no existe. */
  async findByAuthorization(code: string): Promise<{ id: number } | null> {
    const trimmed = code.trim()
    if (!trimmed) return null
    return this.prisma.filingEvent.findFirst({
      where: { authorizationCode: trimmed },
      orderBy: { id: 'desc' },
      select: { id: true },
    })
  }

  /** Detalle de una radicación: cabecera + usuario + doctor + líneas (con nombres de catálogo y labels). */
  async findOne(id: number) {
    const row = await this.prisma.filingEvent.findUnique({ where: { id }, include: { items: true } })
    if (!row) throw new NotFoundException(`Radicación de evento con id ${id} no encontrada.`)

    const measCodes = [...new Set(row.items.map((i) => i.measurementUnit))]
    const dispCodes = [...new Set(row.items.map((i) => i.dispensingUnit))]
    const formCodes = [...new Set(row.items.map((i) => i.pharmaceuticalForm))]

    const [user, doctor, statuses, substatuses, sciUnits, measUnits, forms] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: row.userDocument } }),
      this.prisma.doctor.findUnique({ where: { id: row.doctorDocument } }),
      this.prisma.filingEventStatus.findMany(),
      this.prisma.filingEventSubstatus.findMany(),
      this.prisma.scientificUnit.findMany({ where: { code: { in: measCodes } } }),
      this.prisma.measurementUnit.findMany({ where: { code: { in: dispCodes } } }),
      this.prisma.pharmaceuticalForm.findMany({ where: { code: { in: formCodes } } }),
    ])
    const statusLabel = new Map(statuses.map((s) => [s.code, s.label] as const))
    const substatusLabel = new Map(substatuses.map((s) => [s.code, s.label] as const))
    const sciName = new Map(sciUnits.map((u) => [u.code, u.name] as const))
    const dispDesc = new Map(measUnits.map((u) => [u.code, u.description] as const))
    const formDesc = new Map(forms.map((f) => [f.code, f.description] as const))

    return {
      id: row.id,
      createdAt: row.createdAt,
      authorizationCode: row.authorizationCode,
      senderCode: row.senderCode,
      senderName: row.senderName,
      userType: row.userType,
      doctorDocument: row.doctorDocument,
      userDocument: row.userDocument,
      prescriptionDate: row.prescriptionDate,
      authorizationDate: row.authorizationDate,
      requestDate: row.requestDate,
      mainDiagnosis: row.mainDiagnosis,
      diagnosisDetail: row.diagnosisDetail,
      totalValue: row.totalValue,
      status: row.status,
      statusLabel: statusLabel.get(row.status) ?? row.status,
      filingCode: row.filingCode,
      shelfCode: row.shelfCode,
      contractId: row.contractId,
      user: user
        ? {
            id: user.id,
            documentType: user.documentType,
            firstName: user.firstName,
            secondName: user.secondName,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            gender: user.gender,
            birthDate: user.birthDate,
            healthcareRegime: user.healthcareRegime,
            department: user.department,
            city: user.city,
            neighborhood: user.neighborhood,
            address: user.address,
            phone: user.phone,
            email: user.email,
            description: user.description,
          }
        : null,
      doctor: doctor ? { document: doctor.id, name: doctor.name } : null,
      items: row.items.map((it) => ({
        ...it,
        statusLabel: statusLabel.get(it.status) ?? it.status,
        substatusLabel: it.substatus ? substatusLabel.get(it.substatus) ?? it.substatus : null,
        measurementUnitName: sciName.get(it.measurementUnit) ?? String(it.measurementUnit),
        dispensingUnitName: dispDesc.get(it.dispensingUnit) ?? String(it.dispensingUnit),
        pharmaceuticalFormName: formDesc.get(it.pharmaceuticalForm) ?? it.pharmaceuticalForm,
      })),
    }
  }

  /** Registra el código de radicado en la CABECERA. Solo cuando el estado general es ENTREGADO. */
  async setRadicado(id: number, filingCode: string) {
    const filing = await this.prisma.filingEvent.findUnique({ where: { id } })
    if (!filing) throw new NotFoundException(`Radicación de evento con id ${id} no encontrada.`)
    if (filing.status !== 'ENTREGADO')
      throw new BadRequestException('Solo se puede registrar el radicado cuando la radicación está ENTREGADA.')
    await this.prisma.filingEvent.update({ where: { id }, data: { filingCode: filingCode.trim() } })
    return this.findOne(id)
  }

  /** Edita los valores de prescripción de UNA línea (frecuencia, duración, cantidad prescrita, días). */
  async updatePrescription(
    itemId: number,
    dto: {
      frequencyPerDay?: number
      treatmentDuration?: number
      prescribedQuantity?: number
      treatmentDays?: number
    },
  ) {
    const item = await this.prisma.filingEventItem.findUnique({ where: { id: itemId } })
    if (!item) throw new NotFoundException(`Línea de radicación con id ${itemId} no encontrada.`)
    const data: Prisma.FilingEventItemUpdateInput = {}
    if (dto.frequencyPerDay !== undefined) data.frequencyPerDay = dto.frequencyPerDay
    if (dto.treatmentDuration !== undefined) data.treatmentDuration = dto.treatmentDuration
    if (dto.prescribedQuantity !== undefined) data.prescribedQuantity = dto.prescribedQuantity
    if (dto.treatmentDays !== undefined) data.treatmentDays = dto.treatmentDays
    if (Object.keys(data).length > 0) await this.prisma.filingEventItem.update({ where: { id: itemId }, data })
    return this.findOne(item.filingEventId)
  }

  /** Asigna (o devuelve) el código de estantería de la CABECERA del radicado, para el ticket. */
  async assignShelfCode(id: number): Promise<{ shelfCode: string }> {
    const existing = await this.prisma.filingEvent.findUnique({
      where: { id },
      select: { id: true, shelfCode: true },
    })
    if (!existing) throw new NotFoundException(`Radicación de evento con id ${id} no encontrada.`)
    if (existing.shelfCode) return { shelfCode: existing.shelfCode }

    // Toma el siguiente valor del contador (atómico a nivel de fila) y calcula el código.
    const counter = await this.prisma.shelfCodeCounter.upsert({
      where: { id: 1 },
      create: { id: 1, value: 1 },
      update: { value: { increment: 1 } },
    })
    const code = shelfCodeFromValue(counter.value)

    // Guarda solo si seguía sin código (protege de asignación concurrente del mismo radicado).
    const res = await this.prisma.filingEvent.updateMany({
      where: { id, shelfCode: null },
      data: { shelfCode: code },
    })
    if (res.count === 1) return { shelfCode: code }

    // Carrera: otro proceso ya lo asignó → devuelve el guardado.
    const reread = await this.prisma.filingEvent.findUnique({
      where: { id },
      select: { shelfCode: true },
    })
    return { shelfCode: reread?.shelfCode ?? code }
  }

  /**
   * Registra una entrega de UNA LÍNEA (medicamento/insumo). Tres casos:
   *  - COMPLETA: cierra la línea (ENTREGADO); puede entregar menos (faltante legal → unfulfilled_quantity).
   *  - PARCIAL: entrega una parte → línea ENTREGA_PARCIAL · POR_PEDIR + pedido por el faltante.
   *  - SIN_EXISTENCIAS: no entrega nada → línea sigue PENDIENTE · POR_PEDIR + pedido por todo.
   * Tras actualizar la línea, recalcula el estado general de la cabecera (ENTREGADO si todas las
   * líneas quedaron sin pendiente; si no, PENDIENTE). `employeeId` viene del JWT.
   */
  async registerDelivery(itemId: number, dto: RegisterDeliveryEventDto, employeeId: string) {
    const item = await this.prisma.filingEventItem.findUnique({
      where: { id: itemId },
      include: { filing: { select: { id: true, requestDate: true } } },
    })
    if (!item) throw new NotFoundException(`Línea de radicación con id ${itemId} no encontrada.`)
    if (item.quantityPending <= 0)
      throw new BadRequestException('Este medicamento ya fue entregado por completo')

    if (dto.deliveryType === 'SIN_EXISTENCIAS' && item.quantityDelivered > 0)
      throw new BadRequestException(
        'No se puede marcar "Sin existencias": ya existe una entrega registrada para este medicamento',
      )

    const pending = item.quantityPending
    const isComplete = dto.deliveryType === 'COMPLETA'

    let delivered: number
    if (isComplete) {
      delivered = dto.quantity ?? pending
      if (delivered < 1 || delivered > pending)
        throw new BadRequestException(`La cantidad entregada debe estar entre 1 y ${pending}`)
    } else if (dto.deliveryType === 'PARCIAL') {
      delivered = dto.quantity ?? 0
      if (delivered < 1 || delivered >= pending)
        throw new BadRequestException(`La cantidad parcial debe estar entre 1 y ${pending - 1}`)
    } else {
      delivered = 0 // SIN_EXISTENCIAS
    }

    const pendingAfter = isComplete ? 0 : pending - delivered
    const unfulfilledAdded = isComplete ? pending - delivered : 0
    const newStatus = isComplete
      ? 'ENTREGADO'
      : dto.deliveryType === 'PARCIAL'
        ? 'ENTREGA_PARCIAL'
        : 'PENDIENTE'
    const newSubstatus = isComplete ? 'ENTREGADO' : 'POR_PEDIR'

    // Fecha de entrega + oportunidad de la LÍNEA: se fijan en su 1ª entrega real (delivered>0 y sin fecha).
    // Tope: fecha_solicitud (de la cabecera) + 4 días. Oportunidad = días entre entrega y solicitud (máx. 4).
    let deliveryDateUpdate: Date | undefined
    let opportunityUpdate: number | undefined
    if (delivered > 0 && !item.deliveryDate) {
      const MS_DAY = 86_400_000
      const reqMidnight = new Date(item.filing.requestDate)
      reqMidnight.setHours(0, 0, 0, 0)
      const maxDate = new Date(reqMidnight.getTime() + 4 * MS_DAY)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const chosen = today.getTime() > maxDate.getTime() ? maxDate : today
      const diffDays = Math.round((chosen.getTime() - reqMidnight.getTime()) / MS_DAY)
      deliveryDateUpdate = chosen
      opportunityUpdate = Math.min(4, Math.max(0, diffDays))
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.filingEventItem.update({
        where: { id: itemId },
        data: {
          quantityDelivered: item.quantityDelivered + delivered,
          quantityPending: pendingAfter,
          unfulfilledQuantity: item.unfulfilledQuantity + unfulfilledAdded,
          status: newStatus,
          substatus: newSubstatus,
          ...(deliveryDateUpdate
            ? { deliveryDate: deliveryDateUpdate, opportunity: opportunityUpdate }
            : {}),
        },
      })

      if (dto.deliveryType !== 'SIN_EXISTENCIAS') {
        const count = await tx.deliveryEvent.count({ where: { filingEventItemId: itemId } })
        await tx.deliveryEvent.create({
          data: {
            filingEventItemId: itemId,
            deliveryNumber: count + 1,
            deliveryType: dto.deliveryType,
            quantityDelivered: delivered,
            quantityPendingAfter: pendingAfter,
            employeeId,
            comment: dto.comment ?? null,
          },
        })
      }

      if (pendingAfter > 0) {
        await tx.orderEvent.create({
          data: {
            filingEventItemId: itemId,
            cum: item.cum,
            name: item.name,
            quantity: pendingAfter,
            employeeId,
            status: 'POR_PEDIR',
            isActive: true,
          },
        })
      }

      // Recalcula el estado general de la cabecera: ENTREGADO si NINGUNA línea queda con pendiente.
      const siblings = await tx.filingEventItem.findMany({
        where: { filingEventId: item.filing.id },
        select: { quantityPending: true },
      })
      const allDone = siblings.every((s) => s.quantityPending <= 0)
      await tx.filingEvent.update({
        where: { id: item.filing.id },
        data: { status: allDone ? 'ENTREGADO' : 'PENDIENTE' },
      })

      return { ok: true, status: newStatus, substatus: newSubstatus, delivered, pendingAfter, headerStatus: allDone ? 'ENTREGADO' : 'PENDIENTE' }
    })
  }

  /**
   * Entrega de VARIAS líneas en un mismo proceso (un solo envío, una sola transacción).
   * Cada línea aplica exactamente la misma lógica que `registerDelivery` (COMPLETA / PARCIAL /
   * SIN_EXISTENCIAS). Al final recalcula UNA sola vez el estado general de la cabecera.
   */
  async registerDeliveryBulk(
    filingId: number,
    lines: {
      itemId: number
      deliveryType: 'COMPLETA' | 'PARCIAL' | 'SIN_EXISTENCIAS'
      quantity?: number
      comment?: string
    }[],
    employeeId: string,
  ) {
    const filing = await this.prisma.filingEvent.findUnique({
      where: { id: filingId },
      select: { id: true, requestDate: true, items: true },
    })
    if (!filing) throw new NotFoundException(`Radicación con id ${filingId} no encontrada.`)

    const itemsById = new Map(filing.items.map((it) => [it.id, it]))
    const MS_DAY = 86_400_000

    // 1) Validar y planear TODAS las líneas antes de tocar la base (si una falla, no se aplica ninguna).
    const plans = lines.map((line) => {
      const item = itemsById.get(line.itemId)
      if (!item)
        throw new NotFoundException(`Línea ${line.itemId} no pertenece a la radicación ${filingId}.`)
      if (item.quantityPending <= 0)
        throw new BadRequestException(`El medicamento "${item.name}" ya fue entregado por completo.`)
      if (line.deliveryType === 'SIN_EXISTENCIAS' && item.quantityDelivered > 0)
        throw new BadRequestException(
          `No se puede marcar "Sin existencias" en "${item.name}": ya existe una entrega registrada.`,
        )

      const pending = item.quantityPending
      const isComplete = line.deliveryType === 'COMPLETA'
      let delivered: number
      if (isComplete) {
        delivered = line.quantity ?? pending
        if (delivered < 1 || delivered > pending)
          throw new BadRequestException(
            `La cantidad entregada de "${item.name}" debe estar entre 1 y ${pending}.`,
          )
      } else if (line.deliveryType === 'PARCIAL') {
        delivered = line.quantity ?? 0
        if (delivered < 1 || delivered >= pending)
          throw new BadRequestException(
            `La cantidad parcial de "${item.name}" debe estar entre 1 y ${pending - 1}.`,
          )
      } else {
        delivered = 0
      }

      const pendingAfter = isComplete ? 0 : pending - delivered
      const unfulfilledAdded = isComplete ? pending - delivered : 0
      const newStatus = isComplete
        ? 'ENTREGADO'
        : line.deliveryType === 'PARCIAL'
          ? 'ENTREGA_PARCIAL'
          : 'PENDIENTE'
      const newSubstatus = isComplete ? 'ENTREGADO' : 'POR_PEDIR'

      let deliveryDateUpdate: Date | undefined
      let opportunityUpdate: number | undefined
      if (delivered > 0 && !item.deliveryDate) {
        const reqMidnight = new Date(filing.requestDate)
        reqMidnight.setHours(0, 0, 0, 0)
        const maxDate = new Date(reqMidnight.getTime() + 4 * MS_DAY)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const chosen = today.getTime() > maxDate.getTime() ? maxDate : today
        const diffDays = Math.round((chosen.getTime() - reqMidnight.getTime()) / MS_DAY)
        deliveryDateUpdate = chosen
        opportunityUpdate = Math.min(4, Math.max(0, diffDays))
      }

      return {
        line,
        item,
        delivered,
        pendingAfter,
        unfulfilledAdded,
        newStatus,
        newSubstatus,
        deliveryDateUpdate,
        opportunityUpdate,
      }
    })

    // 2) Aplicar todo en una sola transacción y recalcular la cabecera una vez.
    return this.prisma.$transaction(async (tx) => {
      // Código de lote/proceso: lo comparten todas las entregas de este envío.
      // Secuencia por radicación: E-{filingId}-{n} (n = nº de proceso de entrega de esta radicación).
      const previousBatches = await tx.deliveryEvent.findMany({
        where: { item: { filingEventId: filingId }, deliveryBatch: { not: null } },
        select: { deliveryBatch: true },
        distinct: ['deliveryBatch'],
      })
      const batchCode = `E-${filingId}-${previousBatches.length + 1}`

      const results: {
        itemId: number
        delivered: number
        pendingAfter: number
        status: string
        substatus: string
      }[] = []

      for (const p of plans) {
        await tx.filingEventItem.update({
          where: { id: p.item.id },
          data: {
            quantityDelivered: p.item.quantityDelivered + p.delivered,
            quantityPending: p.pendingAfter,
            unfulfilledQuantity: p.item.unfulfilledQuantity + p.unfulfilledAdded,
            status: p.newStatus,
            substatus: p.newSubstatus,
            ...(p.deliveryDateUpdate
              ? { deliveryDate: p.deliveryDateUpdate, opportunity: p.opportunityUpdate }
              : {}),
          },
        })

        // Registramos SIEMPRE el movimiento del lote (incl. SIN_EXISTENCIAS: entregado 0, todo pendiente),
        // para que el ticket de pendiente y el detalle incluyan parciales y sin existencias.
        const count = await tx.deliveryEvent.count({ where: { filingEventItemId: p.item.id } })
        await tx.deliveryEvent.create({
          data: {
            filingEventItemId: p.item.id,
            deliveryNumber: count + 1,
            deliveryType: p.line.deliveryType,
            quantityDelivered: p.delivered,
            quantityPendingAfter: p.pendingAfter,
            employeeId,
            comment: p.line.comment ?? null,
            deliveryBatch: batchCode,
          },
        })

        if (p.pendingAfter > 0) {
          await tx.orderEvent.create({
            data: {
              filingEventItemId: p.item.id,
              cum: p.item.cum,
              name: p.item.name,
              quantity: p.pendingAfter,
              employeeId,
              status: 'POR_PEDIR',
              isActive: true,
            },
          })
        }

        results.push({
          itemId: p.item.id,
          delivered: p.delivered,
          pendingAfter: p.pendingAfter,
          status: p.newStatus,
          substatus: p.newSubstatus,
        })
      }

      const siblings = await tx.filingEventItem.findMany({
        where: { filingEventId: filingId },
        select: { quantityPending: true },
      })
      const allDone = siblings.every((s) => s.quantityPending <= 0)
      await tx.filingEvent.update({
        where: { id: filingId },
        data: { status: allDone ? 'ENTREGADO' : 'PENDIENTE' },
      })

      return { ok: true, batchCode, headerStatus: allDone ? 'ENTREGADO' : 'PENDIENTE', lines: results }
    })
  }

  /** Todas las entregas de UNA RADICACIÓN (todas sus líneas), con el medicamento y el empleado. */
  async listFilingDeliveries(filingId: number) {
    const deliveries = await this.prisma.deliveryEvent.findMany({
      where: { item: { filingEventId: filingId } },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      include: { item: { select: { shortName: true, name: true, cum: true } } },
    })
    const employeeIds = [...new Set(deliveries.map((d) => d.employeeId))]
    const employees = employeeIds.length
      ? await this.prisma.employee.findMany({ where: { id: { in: employeeIds } } })
      : []
    const employeeName = new Map(employees.map((e) => [e.id, e.name] as const))

    return deliveries.map((d) => ({
      id: d.id,
      itemId: d.filingEventItemId,
      medication: d.item.shortName,
      name: d.item.name,
      cum: d.item.cum,
      deliveryNumber: d.deliveryNumber,
      deliveryType: d.deliveryType,
      quantityDelivered: d.quantityDelivered,
      quantityPendingAfter: d.quantityPendingAfter,
      comment: d.comment,
      deliveryBatch: d.deliveryBatch,
      invoiceDate: d.invoiceDate,
      employeeName: employeeName.get(d.employeeId) ?? d.employeeId,
      createdAt: d.createdAt,
    }))
  }

  /**
   * Setea la fecha de factura/ticket de UN lote (deliveryBatch) de una radicación: se guarda igual en
   * todas las filas de ese lote. Es la fecha con la que se imprimen factura y ticket; la fecha real de la
   * entrega (createdAt) no se toca. Sobrescribe con la última ingresada.
   */
  async setBatchInvoiceDate(filingId: number, batch: string, invoiceDate: string) {
    const result = await this.prisma.deliveryEvent.updateMany({
      where: { deliveryBatch: batch, item: { filingEventId: filingId } },
      data: { invoiceDate: new Date(invoiceDate) },
    })
    if (result.count === 0) {
      throw new NotFoundException(`No hay entregas en el lote ${batch} de la radicación ${filingId}.`)
    }
    return { ok: true, count: result.count }
  }

  /** Historial de entregas de UNA LÍNEA (cada entrega completa/parcial), con el nombre del empleado. */
  async listDeliveries(itemId: number) {
    const deliveries = await this.prisma.deliveryEvent.findMany({
      where: { filingEventItemId: itemId },
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
      deliveryBatch: d.deliveryBatch,
      employeeId: d.employeeId,
      employeeName: employeeName.get(d.employeeId) ?? d.employeeId,
      createdAt: d.createdAt,
    }))
  }
}
