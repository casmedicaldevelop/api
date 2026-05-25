import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { ListServiceUsersDto } from './dto/list-service-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() dto: ListServiceUsersDto) {
    return this.usersService.findAll(dto);
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_usuarios.xlsx"')
  getTemplate(): StreamableFile {
    const buffer = this.usersService.getTemplate();
    return new StreamableFile(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateServiceUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceUserDto) {
    return this.usersService.update(id, dto);
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkImport(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.bulkImport(file);
  }
}
