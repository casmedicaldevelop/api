import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpsertCompanyDto } from './dto/upsert-company.dto'
import { UpdateMipresDto } from './dto/update-mipres.dto'

const SINGLETON_ID = 'singleton'
const MIPRES_BASE_URL = 'https://wsmipres.sispro.gov.co/WSSUMMIPRESNOPBS/api/GenerarToken'

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getCompany() {
    const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } })
    if (!company) throw new NotFoundException('La empresa no ha sido configurada')
    return company
  }

  async upsertCompany(dto: UpsertCompanyDto) {
    return this.prisma.company.upsert({
      where: { id: SINGLETON_ID },
      update: {
        name: dto.name,
        nit: dto.nit,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        city: dto.city ?? null,
        address: dto.address ?? null,
      },
      create: {
        id: SINGLETON_ID,
        name: dto.name,
        nit: dto.nit,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        city: dto.city ?? null,
        address: dto.address ?? null,
      },
    })
  }

  async updateMipres(dto: UpdateMipresDto) {
    const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } })
    if (!company) throw new NotFoundException('La empresa no ha sido configurada')
    return this.prisma.company.update({
      where: { id: SINGLETON_ID },
      data: { tokenCompany: dto.tokenCompany ?? null },
    })
  }

  async generateMipresToken(): Promise<string> {
    const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } })

    if (!company?.nit || !company?.tokenCompany) {
      this.logger.warn('generateMipresToken: NIT o Token Empresa no configurados — omitiendo')
      throw new Error('NIT o Token Empresa no configurados en la empresa')
    }

    const url = `${MIPRES_BASE_URL}/${company.nit}/${company.tokenCompany}`

    this.logger.log(`generateMipresToken: GET ${MIPRES_BASE_URL}/${company.nit}/****`)
    const mipresRes = await fetch(url)

    if (!mipresRes.ok) {
      const body = await mipresRes.text().catch(() => '<unreadable>')
      this.logger.error(
        `MIPRES ${mipresRes.status} ${mipresRes.statusText} — body: ${body}`,
      )
      let detail = body
      try {
        const parsed = JSON.parse(body)
        detail = parsed?.Message ?? parsed?.message ?? body
      } catch {}
      throw new Error(`MIPRES respondió ${mipresRes.status}: ${detail}`)
    }

    const raw = await mipresRes.json()
    const tokenAuth: string = typeof raw === 'string' ? raw : JSON.stringify(raw)

    await this.prisma.company.update({
      where: { id: SINGLETON_ID },
      data: { tokenAuth },
    })

    this.logger.log('generateMipresToken: token de autenticación actualizado correctamente')
    return tokenAuth
  }
}
