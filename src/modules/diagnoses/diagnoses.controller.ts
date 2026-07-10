import { Controller, Get, Query } from '@nestjs/common'
import { DiagnosesService } from './diagnoses.service'

@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly service: DiagnosesService) {}

  @Get()
  search(@Query('search') search?: string, @Query('limit') limit?: string) {
    return this.service.search(search, limit ? parseInt(limit, 10) : 20)
  }
}
