import { Controller, Get } from '@nestjs/common'
import { CatalogsService } from './catalogs.service'

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('measurement-units')
  measurementUnits() {
    return this.catalogsService.listMeasurementUnits()
  }

  @Get('pharmaceutical-forms')
  pharmaceuticalForms() {
    return this.catalogsService.listPharmaceuticalForms()
  }

  @Get('scientific-units')
  scientificUnits() {
    return this.catalogsService.listScientificUnits()
  }
}
