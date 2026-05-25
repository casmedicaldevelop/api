import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { CompanyService } from '../company/company.service'

@Injectable()
export class MipresTokenTask {
  private readonly logger = new Logger(MipresTokenTask.name)

  constructor(private readonly companyService: CompanyService) {}

  @Cron('30 7 * * *', { timeZone: 'America/Bogota' })
  async refreshMipresToken() {
    this.logger.log('Iniciando renovación automática del token MIPRES...')
    try {
      await this.companyService.generateMipresToken()
      this.logger.log('Token MIPRES renovado exitosamente')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Error al renovar token MIPRES: ${message}`)
    }
  }
}
