import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { DriveService } from '../drive/drive.service';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { ListServiceUsersDto } from './dto/list-service-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly drive: DriveService,
  ) {}

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

  // Cuota del Drive (total/usado). Antes de :id.
  @Get('drive-quota')
  driveQuota() {
    return this.drive.getQuota();
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

  // ===== Gestor de archivos por usuario (Drive directo). Raíz USERS/{cédula}. =====

  @Get(':id/files')
  filesRoot(@Param('id') id: string) {
    return this.usersService.filesRoot(id);
  }

  @Get(':id/files-tree')
  filesTree(@Param('id') id: string) {
    return this.usersService.filesTree(id);
  }

  @Post(':id/files/:folderId/folders')
  createFolder(
    @Param('id') id: string,
    @Param('folderId') folderId: string,
    @Body() body: { name: string },
  ) {
    return this.usersService.filesCreateFolder(id, folderId, body?.name);
  }

  @Post(':id/files/:folderId')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id') id: string,
    @Param('folderId') folderId: string,
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer },
  ) {
    return this.usersService.filesUpload(id, folderId, file);
  }

  // Stream para previsualizar/descargar (antes de :id/files/:folderId).
  @Get(':id/files/:itemId/content')
  async fileContent(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Query('disposition') disposition: string,
    @Res() res: Response,
  ) {
    const { stream, mimeType, name } = await this.usersService.filesContent(id, itemId);
    const mode = disposition === 'attachment' ? 'attachment' : 'inline';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `${mode}; filename="${encodeURIComponent(name)}"`);
    stream.pipe(res);
  }

  @Get(':id/files/:folderId')
  filesList(@Param('id') id: string, @Param('folderId') folderId: string) {
    return this.usersService.filesList(id, folderId);
  }

  @Delete(':id/files/:itemId')
  deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.usersService.filesDelete(id, itemId);
  }
}
