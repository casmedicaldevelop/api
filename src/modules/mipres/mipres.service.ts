import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CompanyService } from '../company/company.service'
import { UsersService } from '../users/users.service'
import { FilingMipresService } from '../filing-mipres/filing-mipres.service'
import { UpstreamFailureException } from '../../common/filters/upstream-failure.exception'
import type { User } from '@prisma/client'
import type { WorkspaceResponse } from './types/workspace.response'

const SISPRO_TIMEOUT_MS = 15_000

function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== ''
  return true
}

function isUserComplete(user: User): boolean {
  return (
    isFilled(user.documentType) &&
    isFilled(user.gender) &&
    isFilled(user.firstName) &&
    isFilled(user.secondName) &&
    isFilled(user.firstSurname) &&
    isFilled(user.secondSurname) &&
    isFilled(user.phone) &&
    isFilled(user.email) &&
    isFilled(user.birthDate) &&
    isFilled(user.healthcareRegime) &&
    isFilled(user.city) &&
    isFilled(user.neighborhood) &&
    isFilled(user.address)
  )
}

/**
 * SISPRO responde `PUT /api/Programacion` con `[{ Id, IdProgramacion }]`.
 * Devuelve el IdProgramacion (> 0) o null si la forma no es la esperada.
 */
function extractIdProgramacion(response: unknown): number | null {
  const item = Array.isArray(response) ? response[0] : response
  if (!item || typeof item !== 'object') return null
  const raw = (item as { IdProgramacion?: unknown }).IdProgramacion
  const id = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null
}

/**
 * SISPRO responde `PUT /api/Entrega` con `[{ Id, IdEntrega }]`.
 * Devuelve el IdEntrega (> 0) o null si la forma no es la esperada.
 */
function extractIdEntrega(response: unknown): number | null {
  const item = Array.isArray(response) ? response[0] : response
  if (!item || typeof item !== 'object') return null
  const raw = (item as { IdEntrega?: unknown }).IdEntrega
  const id = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null
}

/**
 * SISPRO responde `PUT /api/ReporteEntrega` con `[{ Id, IdReporteEntrega }]`.
 * Devuelve el IdReporteEntrega (> 0) o null si la forma no es la esperada.
 */
function extractIdReporteEntrega(response: unknown): number | null {
  const item = Array.isArray(response) ? response[0] : response
  if (!item || typeof item !== 'object') return null
  const raw = (item as { IdReporteEntrega?: unknown }).IdReporteEntrega
  const id = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null
}

/**
 * SISPRO responde `PUT /api/Facturacion` con `[{ Id, IdFacturacion }]`
 * (verificado contra respuesta real). El número de factura es `IdFacturacion`.
 * Devuelve el IdFacturacion (> 0) o null si la forma no es la esperada.
 */
function extractIdFacturacion(response: unknown): number | null {
  const item = Array.isArray(response) ? response[0] : response
  if (!item || typeof item !== 'object') return null
  const raw = (item as { IdFacturacion?: unknown }).IdFacturacion
  const id = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null
}

function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const causeCode = (err as { cause?: { code?: unknown } }).cause?.code
  if (typeof causeCode === 'string') {
    return [
      'UND_ERR_CONNECT_TIMEOUT',
      'UND_ERR_HEADERS_TIMEOUT',
      'UND_ERR_BODY_TIMEOUT',
      'UND_ERR_SOCKET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'EAI_AGAIN',
      'ETIMEDOUT',
    ].includes(causeCode)
  }
  return err instanceof TypeError && /fetch failed/i.test((err as Error).message)
}

@Injectable()
export class MipresService {
  private readonly baseUrl: string
  private readonly facBaseUrl: string

  constructor(
    private readonly configService: ConfigService,
    private readonly companyService: CompanyService,
    private readonly usersService: UsersService,
    private readonly filingService: FilingMipresService,
  ) {
    this.baseUrl = this.configService.get<string>('MIPRES_API_URL', 'https://wsmipres.sispro.gov.co/WSSUMMIPRESNOPBS')
    this.facBaseUrl = this.configService.get<string>('MIPRES_FAC_API_URL', 'https://wsmipres.sispro.gov.co/WSFACMIPRESNOPBS')
  }

  private enc(v: string | number) {
    return encodeURIComponent(String(v))
  }

  private async getCreds() {
    const company = await this.companyService.getCompany()
    if (!company.nit) throw new BadRequestException('NIT de empresa no configurado')
    if (!company.tokenAuth) throw new BadRequestException('Token MIPRES no disponible — el cron aún no ha generado el token o no está configurado')
    return { nit: company.nit, tokenAuth: company.tokenAuth }
  }

  private async fetchSispro(method: 'GET' | 'PUT', path: string, body?: unknown, baseUrl?: string): Promise<Response> {
    const url = `${baseUrl ?? this.baseUrl}${path}`
    const route = `${method} ${path}`
    try {
      return await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: AbortSignal.timeout(SISPRO_TIMEOUT_MS),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new UpstreamFailureException(
          'SISPRO',
          `no respondió en ${SISPRO_TIMEOUT_MS / 1000}s`,
          route,
          'TIMEOUT',
        )
      }
      if (isNetworkError(err)) {
        const code = (err as { cause?: { code?: string } }).cause?.code ?? 'NETWORK_ERROR'
        throw new UpstreamFailureException('SISPRO', 'servidor inalcanzable', route, code)
      }
      throw err
    }
  }

  private async get<T>(path: string): Promise<T> {
    const res = await this.fetchSispro('GET', path)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new BadRequestException(text || `MIPRES respondió ${res.status}`)
    }
    return res.json()
  }

  private async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await this.fetchSispro('PUT', path, body)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new BadRequestException(text || `MIPRES respondió ${res.status}`)
    }
    return res.json()
  }

  private async putFac<T>(path: string, body?: unknown): Promise<T> {
    const res = await this.fetchSispro('PUT', path, body, this.facBaseUrl)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new BadRequestException(text || `MIPRES (FAC) respondió ${res.status}`)
    }
    return res.json()
  }

  private async getFac<T>(path: string): Promise<T> {
    const res = await this.fetchSispro('GET', path, undefined, this.facBaseUrl)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new BadRequestException(text || `MIPRES (FAC) respondió ${res.status}`)
    }
    return res.json()
  }

  // ── Routing ───────────────────────────────────────────────────────────────

  async getRoutingsByPrescription(prescriptionNumber: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.get(
      `/api/DireccionamientoXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`,
    )
  }

  async getPrescriptionWorkspace(prescriptionNumber: string): Promise<WorkspaceResponse> {
    const raw = await this.getRoutingsByPrescription(prescriptionNumber)
    const routings = Array.isArray(raw) ? raw : raw ? [raw] : []

    if (routings.length === 0) {
      return { prescriptionNumber, routings: [], patient: null }
    }

    const first = routings[0] as {
      NoIDPaciente?: string
      TipoIDPaciente?: string
      DirPaciente?: string
    }
    const noDoc = String(first.NoIDPaciente ?? '').trim()
    const tipoDoc = String(first.TipoIDPaciente ?? '').trim()
    const address = String(first.DirPaciente ?? '').trim()

    const user = noDoc ? await this.usersService.findOneOrNull(noDoc) : null

    if (user) {
      const isComplete = isUserComplete(user)
      return {
        prescriptionNumber,
        routings,
        patient: { exists: true, isComplete, user },
      }
    }

    return {
      prescriptionNumber,
      routings,
      patient: { exists: false, fromMipres: { tipoDoc, noDoc, address } },
    }
  }

  // ── Schedule ──────────────────────────────────────────────────────────────

  async createSchedule(body: {
    miPresDireccionId: string
    fecMaxEnt: string
    tipoIdSedeProv: string
    noIdSedeProv: string
    codSedeProv: string
    codSerTecAEntregar: string
    cantTotAEntregar: string
    doctorDocument: string
    userDocument: string
    prescriptionNumber: string
    medicationName: string
    inventoryCode?: string | null
    unitPrice: number
  }) {
    const { nit, tokenAuth } = await this.getCreds()
    // 1. Amarre en SISPRO. `put` lanza si la respuesta no es 200.
    const sispro = await this.put<unknown>(
      `/api/Programacion/${this.enc(nit)}/${this.enc(tokenAuth)}`,
      {
        ID: Number(body.miPresDireccionId),
        FecMaxEnt: body.fecMaxEnt,
        TipoIDSedeProv: body.tipoIdSedeProv,
        NoIDSedeProv: body.noIdSedeProv,
        CodSedeProv: body.codSedeProv,
        CodSerTecAEntregar: body.codSerTecAEntregar,
        CantTotAEntregar: body.cantTotAEntregar,
      },
    )

    // 2. Solo si la respuesta es correcta (trae IdProgramacion válido) se
    //    registra el radicado local.
    const idProgramacion = extractIdProgramacion(sispro)
    if (idProgramacion === null) {
      throw new BadRequestException(
        'SISPRO no devolvió un IdProgramacion válido; el radicado no se registró',
      )
    }

    const quantityToDeliver = Number.parseInt(body.cantTotAEntregar, 10)
    const filing = await this.filingService.createFromBinding({
      doctorDocument: body.doctorDocument,
      userDocument: body.userDocument,
      prescriptionNumber: body.prescriptionNumber,
      scheduleId: BigInt(idProgramacion),
      routingId: BigInt(body.miPresDireccionId),
      technologyCode: body.codSerTecAEntregar,
      inventoryCode: body.inventoryCode ?? null,
      medicationName: body.medicationName,
      quantityToDeliver,
      unitPrice: body.unitPrice,
      maxDeliveryDate: new Date(body.fecMaxEnt),
    })

    return { sispro, filing }
  }

  async getSchedulesByPrescription(prescriptionNumber: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.get(
      `/api/ProgramacionXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`,
    )
  }

  async cancelSchedule(scheduleId: string) {
    const { nit, tokenAuth } = await this.getCreds()
    // Solo si SISPRO confirma la anulación (put no lanza) se borra el filing local.
    const result = await this.put(
      `/api/AnularProgramacion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(scheduleId)}`,
    )
    await this.filingService.deleteBySchedule(BigInt(scheduleId))
    return result
  }

  // ── Delivery ──────────────────────────────────────────────────────────────

  async getDeliveriesByPrescription(prescriptionNumber: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.get(
      `/api/EntregaXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`,
    )
  }

  async cancelDelivery(deliveryId: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.put(
      `/api/AnularEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(deliveryId)}`,
    )
  }

  async createDelivery(body: {
    miPresDireccionId: string
    codSerTecEntregado: string
    cantTotEntregada: string
    entTotal: number
    causaNoEntrega: number
    fecEntrega: string
    noLote: string
    tipoIdRecibe: string
    noIdRecibe: string
  }) {
    const { nit, tokenAuth } = await this.getCreds()
    const sispro = await this.put(
      `/api/Entrega/${this.enc(nit)}/${this.enc(tokenAuth)}`,
      {
        ID: Number(body.miPresDireccionId),
        CodSerTecEntregado: body.codSerTecEntregado,
        CantTotEntregada: body.cantTotEntregada,
        EntTotal: body.entTotal,
        CausaNoEntrega: body.causaNoEntrega,
        FecEntrega: body.fecEntrega,
        NoLote: body.noLote,
        TipoIDRecibe: body.tipoIdRecibe,
        NoIDRecibe: body.noIdRecibe,
      },
    )

    // Trazabilidad en el radicado del direccionamiento (siempre único):
    // delivery_id ← IdEntrega de SISPRO, delivery_date ← fecha de la entrega.
    const idEntrega = extractIdEntrega(sispro)
    if (idEntrega !== null) {
      await this.filingService.setDeliveryByRouting(
        BigInt(body.miPresDireccionId),
        BigInt(idEntrega),
        new Date(body.fecEntrega),
      )
    }

    return sispro
  }

  // ── DeliveryReport (Tx -7-) ──────────────────────────────────────────────
  // Reports each delivery to SISPRO so the EPS pays the provider.
  // EstadoEntrega and CausaNoEntrega are hardcoded per business rule:
  // only successful deliveries get reported.

  async createDeliveryReport(body: {
    miPresEntregaId: string
    valorEntregado: string
    deliveryId: string
  }) {
    const { nit, tokenAuth } = await this.getCreds()
    const sispro = await this.put(
      `/api/ReporteEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}`,
      {
        ID: Number(body.miPresEntregaId),
        EstadoEntrega: 1,
        CausaNoEntrega: 0,
        ValorEntregado: body.valorEntregado,
      },
    )

    // Trazabilidad local: en el radicado cuyo delivery_id = IDEntrega, persiste
    // delivery_report_id ← IdReporteEntrega que devolvió SISPRO.
    const idReporte = extractIdReporteEntrega(sispro)
    if (idReporte !== null) {
      await this.filingService.setDeliveryReportByDelivery(
        BigInt(body.deliveryId),
        BigInt(idReporte),
      )
    }

    return sispro
  }

  async getDeliveryReportsByPrescription(prescriptionNumber: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.get(
      `/api/ReporteEntregaXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`,
    )
  }

  async cancelDeliveryReport(reportId: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.put(
      `/api/AnularReporteEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(reportId)}`,
    )
  }

  // ── Facturación (Tx -1-, WSFACMIPRESNOPBS) ───────────────────────────────
  // Passthrough. El frontend arma el payload con los 16 campos PascalCase y
  // este método solo lo reenvía a SISPRO Facturación.

  async createFacturacion(body: {
    NoPrescripcion: string
    TipoTec: string
    ConTec: number
    TipoIDPaciente: string
    NoIDPaciente: string
    NoEntrega: number
    NoSubEntrega: number
    NoFactura: string
    NoIDEPS: string
    CodEPS: string
    CodSerTecAEntregado: string
    CantUnMinDis: string
    ValorUnitFacturado: string
    ValorTotFacturado: string
    CuotaModer: string
    Copago: string
    deliveryReportId: string
  }) {
    // deliveryReportId no va a SISPRO: solo para la persistencia local.
    const { deliveryReportId, ...sisproBody } = body
    const { nit, tokenAuth } = await this.getCreds()
    const sispro = await this.putFac(
      `/api/Facturacion/${this.enc(nit)}/${this.enc(tokenAuth)}`,
      sisproBody,
    )

    // Trazabilidad local: en el radicado cuyo delivery_report_id = IDReporteEntrega,
    // persiste billing_id ← IDFacturacion (SISPRO) e invoice_code ← NoFactura.
    const idFactura = extractIdFacturacion(sispro)
    if (idFactura !== null) {
      await this.filingService.setBillingByDeliveryReport(
        BigInt(deliveryReportId),
        BigInt(idFactura),
        sisproBody.NoFactura,
      )
    }

    return sispro
  }

  async getFacturacionesByPrescription(prescriptionNumber: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.getFac(
      `/api/FacturacionXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`,
    )
  }

  async cancelFacturacion(idFacturacion: string) {
    const { nit, tokenAuth } = await this.getCreds()
    return this.putFac(
      `/api/FacturacionAnular/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(idFacturacion)}`,
    )
  }
}
