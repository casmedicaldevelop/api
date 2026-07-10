import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { CompanyService } from './company.service'
import { UpsertCompanyDto } from './dto/upsert-company.dto'
import { UpdateMipresDto } from './dto/update-mipres.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getCompany() {
    return this.companyService.getCompany()
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRADOR')
  @HttpCode(HttpStatus.OK)
  upsertCompany(@Body() dto: UpsertCompanyDto) {
    return this.companyService.upsertCompany(dto)
  }

  @Patch('mipres')
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRADOR')
  @HttpCode(HttpStatus.OK)
  updateMipres(@Body() dto: UpdateMipresDto) {
    return this.companyService.updateMipres(dto)
  }

  @Post('mipres/refresh-token')
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRADOR')
  @HttpCode(HttpStatus.OK)
  async refreshMipresToken() {
    await this.companyService.generateMipresToken()
    return this.companyService.getCompany()
  }
}
