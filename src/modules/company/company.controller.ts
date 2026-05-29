import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Put, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { CompanyService } from './company.service'
import { UpsertCompanyDto } from './dto/upsert-company.dto'
import { UpdateMipresDto } from './dto/update-mipres.dto'
import { UpdateAiDto } from './dto/update-ai.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getCompany(@Req() req: Request & { user?: { role?: string } }) {
    return this.companyService.getCompany(req.user?.role)
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  upsertCompany(@Body() dto: UpsertCompanyDto) {
    return this.companyService.upsertCompany(dto)
  }

  @Patch('mipres')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  updateMipres(@Body() dto: UpdateMipresDto) {
    return this.companyService.updateMipres(dto)
  }

  @Post('mipres/refresh-token')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async refreshMipresToken() {
    await this.companyService.generateMipresToken()
    return this.companyService.getCompany('ADMIN')
  }

  @Patch('ai')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  updateAi(@Body() dto: UpdateAiDto) {
    return this.companyService.updateAi(dto)
  }
}
