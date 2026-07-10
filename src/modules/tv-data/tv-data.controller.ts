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
import { TvDataService } from './tv-data.service'
import { CreateTvDataDto } from './dto/create-tv-data.dto'
import { UpdateTvDataDto } from './dto/update-tv-data.dto'
import { ListTvDataDto } from './dto/list-tv-data.dto'

@Controller('tv-data')
export class TvDataController {
  constructor(private readonly tvDataService: TvDataService) {}

  @Get()
  findAll(@Query() dto: ListTvDataDto) {
    return this.tvDataService.findAll(dto)
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_tvmed.xlsx"')
  getTemplate(): StreamableFile {
    const buffer = this.tvDataService.getTemplate()
    return new StreamableFile(buffer)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tvDataService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateTvDataDto) {
    return this.tvDataService.create(dto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTvDataDto) {
    return this.tvDataService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tvDataService.remove(id)
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@UploadedFile() file: Express.Multer.File) {
    return this.tvDataService.bulkUpload(file)
  }
}
