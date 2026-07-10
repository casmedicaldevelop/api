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
import { TvMedEventoService } from './tvmed-evento.service'
import { CreateTvMedEventoDto } from './dto/create-tvmed-evento.dto'
import { UpdateTvMedEventoDto } from './dto/update-tvmed-evento.dto'
import { ListTvMedEventoDto } from './dto/list-tvmed-evento.dto'
import { ApplyUpdateDto, MissingTemplateDto } from './dto/update-massive-tvmed-evento.dto'

@Controller('tvmed-evento')
export class TvMedEventoController {
  constructor(private readonly service: TvMedEventoService) {}

  @Get()
  findAll(@Query() dto: ListTvMedEventoDto) {
    return this.service.findAll(dto)
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_tvmed_evento.xlsx"')
  getTemplate(): StreamableFile {
    return new StreamableFile(this.service.getTemplate())
  }

  @Get('update/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_actualizacion_tvmed_evento.xlsx"')
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
  create(@Body() dto: CreateTvMedEventoDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTvMedEventoDto) {
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
  @Header('Content-Disposition', 'attachment; filename="faltantes_tvmed_evento.xlsx"')
  missingTemplate(@Body() dto: MissingTemplateDto): StreamableFile {
    return new StreamableFile(this.service.getMissingTemplate(dto.rows))
  }
}
