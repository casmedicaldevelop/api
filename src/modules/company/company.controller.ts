import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { CompanyService } from './company.service'
import { UpsertCompanyDto } from './dto/upsert-company.dto'
import { UpdateMipresDto } from './dto/update-mipres.dto'
import { UpdateAiDto } from './dto/update-ai.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('company')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getCompany() {
    return this.companyService.getCompany()
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  upsertCompany(@Body() dto: UpsertCompanyDto) {
    return this.companyService.upsertCompany(dto)
  }

  @Patch('mipres')
  @HttpCode(HttpStatus.OK)
  updateMipres(@Body() dto: UpdateMipresDto) {
    return this.companyService.updateMipres(dto)
  }

  @Post('mipres/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshMipresToken() {
    await this.companyService.generateMipresToken()
    return this.companyService.getCompany()
  }

  @Patch('ai')
  @HttpCode(HttpStatus.OK)
  updateAi(@Body() dto: UpdateAiDto) {
    return this.companyService.updateAi(dto)
  }
}
