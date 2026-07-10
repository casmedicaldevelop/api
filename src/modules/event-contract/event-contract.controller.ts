import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { EventContractService } from './event-contract.service'
import { CreateEventContractDto } from './dto/create-event-contract.dto'
import { FinalizeEventContractDto } from './dto/finalize-event-contract.dto'
import { SetOpenEventContractDto } from './dto/set-open-event-contract.dto'

@Controller('event-contract')
export class EventContractController {
  constructor(private readonly service: EventContractService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get('active')
  findActive() {
    return this.service.findActive()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateEventContractDto) {
    return this.service.create(dto)
  }

  @Patch(':id/open')
  setOpen(@Param('id', ParseIntPipe) id: number, @Body() dto: SetOpenEventContractDto) {
    return this.service.setOpen(id, dto.isOpen)
  }

  @Patch(':id/finalize')
  finalize(@Param('id', ParseIntPipe) id: number, @Body() dto: FinalizeEventContractDto) {
    return this.service.finalize(id, dto)
  }
}
