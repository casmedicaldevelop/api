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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { AssignCumProvider1Dto } from './dto/assign-cum-provider1.dto';
import { SkipCumProvider1Dto } from './dto/skip-cum-provider1.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() dto: ListProductsDto) {
    return this.productsService.findAll(dto);
  }

  @Get('bulk/template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="plantilla_productos.xlsx"')
  getTemplate(): StreamableFile {
    const buffer = this.productsService.getTemplate();
    return new StreamableFile(buffer);
  }

  @Get('cum-matching/provider1/pending')
  getCumPendingProvider1() {
    return this.productsService.getCumPendingProvider1();
  }

  @Get('cum-matching/provider1/suggestions')
  getCumSuggestionsProvider1(@Query('q') q: string) {
    return this.productsService.getCumSuggestionsProvider1(q ?? '');
  }

  @Post('cum-matching/provider1/assign')
  assignCumProvider1(@Body() dto: AssignCumProvider1Dto) {
    return this.productsService.assignCumProvider1(dto);
  }

  @Post('cum-matching/provider1/skip')
  skipCumProvider1(@Body() dto: SkipCumProvider1Dto) {
    return this.productsService.skipCumProvider1(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.bulkUpload(file);
  }
}
