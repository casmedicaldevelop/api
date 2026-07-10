import { Controller, Get } from '@nestjs/common'
import { FilingMipresCatalogService } from './filing-mipres-catalog.service'

@Controller('filing-mipres/catalog')
export class FilingMipresCatalogController {
  constructor(private readonly service: FilingMipresCatalogService) {}

  @Get('statuses')
  listStatuses() {
    return this.service.listStatuses()
  }

  @Get('substatuses')
  listSubstatuses() {
    return this.service.listSubstatuses()
  }
}
