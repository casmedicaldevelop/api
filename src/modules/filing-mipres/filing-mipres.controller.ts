import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { FilingMipresService } from './filing-mipres.service'
import { ListFilingMipresDto } from './dto/list-filing-mipres.dto'
import { RegisterDeliveryDto } from './dto/register-delivery.dto'
import { UpdateRadicacionDto } from './dto/update-radicacion.dto'
import { DriveService } from '../drive/drive.service'

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

@Controller('filing-mipres')
export class FilingMipresController {
  constructor(
    private readonly service: FilingMipresService,
    private readonly drive: DriveService,
  ) {}

  @Get()
  findAll(@Query() dto: ListFilingMipresDto) {
    return this.service.findAll(dto)
  }

  // schedule_id (IdProgramacion) con entregas locales, para deshabilitar la anulación.
  // Debe declararse ANTES de :id para que no lo capture el ParseIntPipe.
  @Get('delivered-schedule-ids')
  deliveredScheduleIds(@Query('prescriptionNumber') prescriptionNumber: string) {
    return this.service.scheduleIdsWithDeliveries(prescriptionNumber)
  }

  // total_price por IDEntrega (delivery_id) para precargar el valor del reporte.
  // Debe declararse ANTES de :id para que no lo capture el ParseIntPipe.
  @Get('delivery-totals')
  deliveryTotals(@Query('prescriptionNumber') prescriptionNumber: string) {
    return this.service.deliveryTotalsByPrescription(prescriptionNumber)
  }

  // routing_id + unit_price por IDReporteEntrega (delivery_report_id) para la facturación.
  // Debe declararse ANTES de :id para que no lo capture el ParseIntPipe.
  @Get('facturacion-prefill')
  facturacionPrefill(@Query('prescriptionNumber') prescriptionNumber: string) {
    return this.service.facturacionPrefillByPrescription(prescriptionNumber)
  }

  // Exporta a Excel todos los radicados del filtro actual. Antes de :id.
  @Get('export')
  async export(@Query() dto: ListFilingMipresDto, @Res() res: Response) {
    const buffer = await this.service.exportAll(dto)
    res.setHeader('Content-Type', XLSX_MIME)
    res.setHeader('Content-Disposition', 'attachment; filename="registros-mipres.xlsx"')
    res.send(buffer)
  }

  // Sube el mismo Excel (con el filtro actual) al Google Drive de la empresa.
  // Antes de :id. Devuelve { id, webViewLink } del archivo en Drive.
  @Get('export/drive')
  async exportToDrive(@Query() dto: ListFilingMipresDto) {
    const buffer = await this.service.exportAll(dto)
    const date = new Date().toISOString().slice(0, 10)
    return this.drive.uploadBuffer(buffer, `registros-mipres-${date}.xlsx`, XLSX_MIME)
  }

  // Busca el radicado por schedule_id (IDProgramacion del código de barras). Antes de :id.
  @Get('by-schedule/:scheduleId')
  findIdBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.service.findIdBySchedule(scheduleId)
  }

  // Cuota del Drive (total/usado). Antes de :id.
  @Get('drive-quota')
  driveQuota() {
    return this.drive.getQuota()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  // Cierre de radicación (F. Factura + CUFE + Radicado).
  @Patch(':id/radicacion')
  updateRadicacion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRadicacionDto) {
    return this.service.updateRadicacion(id, dto)
  }

  // Asigna (o devuelve) el código de estantería del radicado para el ticket.
  @Post(':id/shelf-code')
  assignShelfCode(@Param('id', ParseIntPipe) id: number) {
    return this.service.assignShelfCode(id)
  }

  // Historial de entregas del filing.
  @Get(':id/deliveries')
  listDeliveries(@Param('id', ParseIntPipe) id: number) {
    return this.service.listDeliveries(id)
  }

  // Registrar una entrega (COMPLETA / PARCIAL / SIN_EXISTENCIAS). El empleado sale del JWT.
  @Post(':id/deliveries')
  registerDelivery(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegisterDeliveryDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.service.registerDelivery(id, dto, req.user.sub)
  }

  // ===== Gestor de archivos por radicado (Drive directo). Solo si está ENTREGADO. =====

  // Contenido de la raíz FILING_MIPRES/{id} (la asegura si no existe).
  @Get(':id/files')
  filesRoot(@Param('id', ParseIntPipe) id: number) {
    return this.service.filesRoot(id)
  }

  // Árbol completo de carpetas del radicado (barrido recursivo, una sola vez).
  @Get(':id/files-tree')
  filesTree(@Param('id', ParseIntPipe) id: number) {
    return this.service.filesTree(id)
  }

  // Crear subcarpeta en folderId.
  @Post(':id/files/:folderId/folders')
  createFolder(
    @Param('id', ParseIntPipe) id: number,
    @Param('folderId') folderId: string,
    @Body() body: { name: string },
  ) {
    return this.service.filesCreateFolder(id, folderId, body?.name)
  }

  // Subir archivo a folderId.
  @Post(':id/files/:folderId')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @Param('folderId') folderId: string,
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer },
  ) {
    return this.service.filesUpload(id, folderId, file)
  }

  // Stream de bytes para previsualizar/descargar (debe declararse antes de :id/files/:folderId).
  @Get(':id/files/:itemId/content')
  async fileContent(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId') itemId: string,
    @Query('disposition') disposition: string,
    @Res() res: Response,
  ) {
    const { stream, mimeType, name } = await this.service.filesContent(id, itemId)
    const mode = disposition === 'attachment' ? 'attachment' : 'inline'
    res.setHeader('Content-Type', mimeType)
    res.setHeader('Content-Disposition', `${mode}; filename="${encodeURIComponent(name)}"`)
    stream.pipe(res)
  }

  // Listar contenido de una subcarpeta.
  @Get(':id/files/:folderId')
  filesList(@Param('id', ParseIntPipe) id: number, @Param('folderId') folderId: string) {
    return this.service.filesList(id, folderId)
  }

  // Eliminar archivo o carpeta.
  @Delete(':id/files/:itemId')
  deleteItem(@Param('id', ParseIntPipe) id: number, @Param('itemId') itemId: string) {
    return this.service.filesDelete(id, itemId)
  }
}
