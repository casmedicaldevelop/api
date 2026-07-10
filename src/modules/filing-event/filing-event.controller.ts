import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { FilingEventService } from './filing-event.service'
import { DriveService } from '../drive/drive.service'
import { CreateFilingEventDto } from './dto/create-filing-event.dto'
import { ListFilingEventDto } from './dto/list-filing-event.dto'
import { RegisterDeliveryEventDto } from './dto/register-delivery-event.dto'
import { RegisterDeliveryBulkEventDto } from './dto/register-delivery-bulk-event.dto'
import { SetRadicadoEventDto } from './dto/set-radicado-event.dto'
import { UpdatePrescriptionEventDto } from './dto/update-prescription-event.dto'
import { SetInvoiceDateEventDto } from './dto/set-invoice-date-event.dto'

@Controller('filing-event')
export class FilingEventController {
  constructor(
    private readonly service: FilingEventService,
    private readonly drive: DriveService,
  ) {}

  // Cuota del Drive (total/usado). Antes de :id.
  @Get('drive-quota')
  driveQuota() {
    return this.drive.getQuota()
  }

  @Get()
  list(@Query() dto: ListFilingEventDto) {
    return this.service.list(dto)
  }

  // Verifica si ya existe una radicación con ese número de autorización (exacto). Devuelve { id } o null.
  @Get('by-authorization/:code')
  findByAuthorization(@Param('code') code: string) {
    return this.service.findByAuthorization(code)
  }

  // Exporta a Excel todos los registros del filtro (una fila por medicamento/insumo). Antes de :id.
  @Get('export')
  async export(@Query() dto: ListFilingEventDto, @Res() res: Response) {
    const buffer = await this.service.exportAll(dto)
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader('Content-Disposition', 'attachment; filename="registros-evento.xlsx"')
    res.end(buffer)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  // Registra el código de radicado (solo cuando está ENTREGADO).
  @Patch(':id/radicado')
  setRadicado(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRadicadoEventDto) {
    return this.service.setRadicado(id, dto.filingCode)
  }

  // Edita los valores de prescripción de UNA línea (frecuencia, duración, cantidad prescrita, días).
  @Patch('items/:itemId/prescription')
  updatePrescription(@Param('itemId', ParseIntPipe) itemId: number, @Body() dto: UpdatePrescriptionEventDto) {
    return this.service.updatePrescription(itemId, dto)
  }

  // Asigna (o devuelve) el código de estantería de la cabecera del radicado para el ticket.
  @Post(':id/shelf-code')
  assignShelfCode(@Param('id', ParseIntPipe) id: number) {
    return this.service.assignShelfCode(id)
  }

  // Historial de entregas de UNA línea.
  @Get('items/:itemId/deliveries')
  listDeliveries(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.service.listDeliveries(itemId)
  }

  // Todas las entregas de UNA radicación (todas sus líneas).
  @Get(':id/deliveries')
  listFilingDeliveries(@Param('id', ParseIntPipe) id: number) {
    return this.service.listFilingDeliveries(id)
  }

  // Fija la fecha de factura/ticket de un lote (se guarda en todas sus filas). La fecha real no se toca.
  @Patch(':id/batches/:batch/invoice-date')
  setBatchInvoiceDate(
    @Param('id', ParseIntPipe) id: number,
    @Param('batch') batch: string,
    @Body() dto: SetInvoiceDateEventDto,
  ) {
    return this.service.setBatchInvoiceDate(id, batch, dto.invoiceDate)
  }

  // Registrar una entrega de UNA línea (COMPLETA / PARCIAL / SIN_EXISTENCIAS). El empleado sale del JWT.
  @Post('items/:itemId/deliveries')
  registerDelivery(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: RegisterDeliveryEventDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.service.registerDelivery(itemId, dto, req.user.sub)
  }

  // Registrar la entrega de VARIAS líneas en un mismo proceso (una sola transacción). Empleado del JWT.
  @Post(':id/deliveries')
  registerDeliveryBulk(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegisterDeliveryBulkEventDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.service.registerDeliveryBulk(id, dto.lines, req.user.sub)
  }

  // ===== Gestor de archivos por radicado de evento (Drive directo, carpeta por código de autorización). =====

  // Contenido de la raíz FILING_EVENT/{códigoAutorización} (la asegura si no existe).
  @Get(':id/files')
  filesRoot(@Param('id', ParseIntPipe) id: number) {
    return this.service.filesRoot(id)
  }

  // Árbol completo de carpetas del radicado.
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

  @Post('ocr')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 20 * 1024 * 1024 } }))
  extractPdf(@UploadedFile() file: Express.Multer.File) {
    return this.service.extractPdf(file)
  }

  @Post()
  create(@Body() dto: CreateFilingEventDto) {
    return this.service.create(dto)
  }
}
