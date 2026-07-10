import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { DoctorsService } from './doctors.service'
import { CreateDoctorDto } from './dto/create-doctor.dto'
import { ListDoctorsDto } from './dto/list-doctors.dto'

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) {}

  @Get()
  findAll(@Query() dto: ListDoctorsDto) {
    return this.service.findAll(dto)
  }

  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.service.create(dto)
  }
}
