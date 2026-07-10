import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common'
import { MipresService } from './mipres.service'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { CreateDeliveryDto } from './dto/create-delivery.dto'
import { CreateDeliveryReportDto } from './dto/create-delivery-report.dto'
import { CreateFacturacionDto } from './dto/create-facturacion.dto'

@Controller('mipres')
export class MipresController {
  constructor(private readonly mipresService: MipresService) {}

  // ── Routing ───────────────────────────────────────────────────────────────

  @Get('routing/prescription/:prescriptionNumber')
  getRoutingsByPrescription(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getRoutingsByPrescription(prescriptionNumber)
  }

  @Get('prescription/:prescriptionNumber/workspace')
  getWorkspace(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getPrescriptionWorkspace(prescriptionNumber)
  }

  // ── Schedule ──────────────────────────────────────────────────────────────

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  createSchedule(@Body() body: CreateScheduleDto) {
    return this.mipresService.createSchedule(body)
  }

  @Get('schedule/prescription/:prescriptionNumber')
  getSchedulesByPrescription(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getSchedulesByPrescription(prescriptionNumber)
  }

  @Put('schedule/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelSchedule(@Param('id') id: string) {
    return this.mipresService.cancelSchedule(id)
  }

  // ── Delivery ──────────────────────────────────────────────────────────────

  @Get('delivery/prescription/:prescriptionNumber')
  getDeliveriesByPrescription(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getDeliveriesByPrescription(prescriptionNumber)
  }

  @Put('delivery/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelDelivery(@Param('id') id: string) {
    return this.mipresService.cancelDelivery(id)
  }

  @Post('delivery')
  @HttpCode(HttpStatus.OK)
  createDelivery(@Body() body: CreateDeliveryDto) {
    return this.mipresService.createDelivery(body)
  }

  // ── DeliveryReport ────────────────────────────────────────────────────────

  @Post('delivery-report')
  @HttpCode(HttpStatus.OK)
  createDeliveryReport(@Body() body: CreateDeliveryReportDto) {
    return this.mipresService.createDeliveryReport(body)
  }

  @Get('delivery-report/prescription/:prescriptionNumber')
  getDeliveryReportsByPrescription(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getDeliveryReportsByPrescription(prescriptionNumber)
  }

  @Put('delivery-report/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelDeliveryReport(@Param('id') id: string) {
    return this.mipresService.cancelDeliveryReport(id)
  }

  // ── Facturación ───────────────────────────────────────────────────────────

  @Put('facturacion')
  @HttpCode(HttpStatus.OK)
  createFacturacion(@Body() body: CreateFacturacionDto) {
    return this.mipresService.createFacturacion(body)
  }

  @Get('facturacion/prescription/:prescriptionNumber')
  getFacturacionesByPrescription(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.mipresService.getFacturacionesByPrescription(prescriptionNumber)
  }

  @Put('facturacion/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelFacturacion(@Param('id') id: string) {
    return this.mipresService.cancelFacturacion(id)
  }
}
