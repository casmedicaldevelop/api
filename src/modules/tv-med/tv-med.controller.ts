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
import { TvMedService } from './tv-med.service'
import { CreateTvMedDto } from './dto/create-tv-med.dto'
import { UpdateTvMedDto } from './dto/update-tv-med.dto'
import { ListTvMedDto } from './dto/list-tv-med.dto'

@Controller('tv-med')
export class TvMedController {
  constructor(private readonly tvMedService: TvMedService) {}

  @Get()
  findAll(@Query() dto: ListTvMedDto) {
    return this.tvMedService.findAll(dto)
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_tvmed.xlsx"')
  getTemplate(): StreamableFile {
    const buffer = this.tvMedService.getTemplate()
    return new StreamableFile(buffer)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tvMedService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateTvMedDto) {
    return this.tvMedService.create(dto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTvMedDto) {
    return this.tvMedService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tvMedService.remove(id)
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@UploadedFile() file: Express.Multer.File) {
    return this.tvMedService.bulkUpload(file)
  }
}
