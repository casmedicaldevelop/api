import { EmployeesService } from './employees.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AssignStaffModulesDto } from './dto/assign-staff-modules.dto';
import { ListStaffDto } from './dto/list-staff.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(dto: ListStaffDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    create(dto: CreateStaffDto): Promise<{
        temporaryPassword: string;
        id: string;
        name: string;
        username: string;
        email: string;
    }>;
    update(id: string, dto: UpdateStaffDto, req: {
        user: {
            sub: string;
        };
    }): Promise<any>;
    assignModules(id: string, dto: AssignStaffModulesDto): Promise<{
        message: string;
        modules: any[];
    }>;
}
