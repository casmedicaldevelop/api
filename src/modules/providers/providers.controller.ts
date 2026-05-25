import {
  Body,
  Controller,
  Get,
  Header,
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
import { ProvidersService } from './providers.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ListProviderProductsDto } from './dto/list-provider-products.dto';
import { UpdateProviderProductDto } from './dto/update-provider-product.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, dto);
  }

  @Get(':id/products/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_proveedor.xlsx"')
  async getTemplate(@Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
    const provider = await this.providersService.findOne(id);
    const buffer = this.providersService.getTemplate(provider.name);
    return new StreamableFile(buffer);
  }

  @Get(':id/products')
  findProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: ListProviderProductsDto,
  ) {
    return this.providersService.findProducts(id, dto);
  }

  @Get(':id/products/:code')
  findProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('code') code: string,
  ) {
    return this.providersService.findProduct(id, code);
  }

  @Patch(':id/products/:code')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('code') code: string,
    @Body() dto: UpdateProviderProductDto,
  ) {
    return this.providersService.updateProduct(id, code, dto);
  }

  @Post(':id/products/bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('mode') mode: string,
  ) {
    if (mode !== 'upload' && mode !== 'update') mode = 'update';
    return this.providersService.bulkUpload(id, file, mode as 'upload' | 'update');
  }
}
