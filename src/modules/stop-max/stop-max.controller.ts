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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StopMaxService } from './stop-max.service';
import { CreateStopMaxDto } from './dto/create-stop-max.dto';
import { UpdateStopMaxDto } from './dto/update-stop-max.dto';
import { ListStopMaxDto } from './dto/list-stop-max.dto';

@Controller('stop-max')
export class StopMaxController {
  constructor(private readonly stopMaxService: StopMaxService) {}

  @Get()
  findAll(@Query() dto: ListStopMaxDto) {
    return this.stopMaxService.findAll(dto);
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_topes_maximos.xlsx"')
  getTemplate(): StreamableFile {
    const buffer = this.stopMaxService.getTemplate();
    return new StreamableFile(buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stopMaxService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateStopMaxDto) {
    return this.stopMaxService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStopMaxDto) {
    return this.stopMaxService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stopMaxService.remove(id);
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@UploadedFile() file: Express.Multer.File) {
    return this.stopMaxService.bulkUpload(file);
  }
}
