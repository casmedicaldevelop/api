import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { TvInsEventoService } from './tvins-evento.service'
import { CreateTvInsEventoDto } from './dto/create-tvins-evento.dto'
import { UpdateTvInsEventoDto } from './dto/update-tvins-evento.dto'
import { ListTvInsEventoDto } from './dto/list-tvins-evento.dto'
import { ApplyUpdateDto, MissingTemplateDto } from './dto/update-massive-tvins-evento.dto'

@Controller('tvins-evento')
export class TvInsEventoController {
  constructor(private readonly service: TvInsEventoService) {}

  @Get()
  findAll(@Query() dto: ListTvInsEventoDto) {
    return this.service.findAll(dto)
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_tvins_evento.xlsx"')
  getTemplate(): StreamableFile {
    return new StreamableFile(this.service.getTemplate())
  }

  @Get('update/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_actualizacion_tvins_evento.xlsx"')
  getUpdateTemplate(): StreamableFile {
    return new StreamableFile(this.service.getUpdateTemplate())
  }

  @Get('by-cum/:cum')
  findByCum(@Param('cum') cum: string) {
    return this.service.findByCum(cum)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateTvInsEventoDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTvInsEventoDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@UploadedFile() file: Express.Multer.File) {
    return this.service.bulkUpload(file)
  }

  @Post('update/preview')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  previewUpdate(@UploadedFile() file: Express.Multer.File) {
    return this.service.previewUpdate(file)
  }

  @Post('update/apply')
  applyUpdate(@Body() dto: ApplyUpdateDto) {
    return this.service.applyUpdate(dto.items)
  }

  @Post('update/missing-template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="faltantes_tvins_evento.xlsx"')
  missingTemplate(@Body() dto: MissingTemplateDto): StreamableFile {
    return new StreamableFile(this.service.getMissingTemplate(dto.rows))
  }
}
