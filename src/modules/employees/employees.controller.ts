import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmployeesService } from './employees.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AssignStaffModulesDto } from './dto/assign-staff-modules.dto';
import { ListStaffDto } from './dto/list-staff.dto';

@Controller('employees')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query() dto: ListStaffDto) {
    return this.employeesService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateStaffDto) {
    return this.employeesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.employeesService.update(id, dto, req.user.sub);
  }

  @Post(':id/modules')
  assignModules(@Param('id') id: string, @Body() dto: AssignStaffModulesDto) {
    return this.employeesService.assignModules(id, dto);
  }
}
