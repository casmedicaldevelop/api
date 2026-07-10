import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SystemModulesService } from './system-modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';

class ListModulesQuery {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}

@Controller('modules')
@UseGuards(RolesGuard)
export class SystemModulesController {
  constructor(private readonly service: SystemModulesService) {}

  @Get()
  @Roles('ADMINISTRADOR')
  findAll(@Query() query: ListModulesQuery) {
    return this.service.findAll(query.isActive);
  }

  @Get(':id')
  @Roles('ADMINISTRADOR')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRADOR')
  create(@Body() dto: CreateModuleDto) {
    return this.service.create(dto);
  }

  @Patch('reorder')
  @Roles('ADMINISTRADOR')
  @HttpCode(204)
  reorder(@Body() dto: ReorderModulesDto) {
    return this.service.reorder(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRADOR')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
