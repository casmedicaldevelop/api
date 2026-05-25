import { SystemModulesService } from './system-modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
declare class ListModulesQuery {
    isActive?: boolean;
}
export declare class SystemModulesController {
    private readonly service;
    constructor(service: SystemModulesService);
    findAll(query: ListModulesQuery): Promise<{
        id: string;
        name: string;
        label: string;
        icon: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        assignedUsersCount: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        label: string;
        icon: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        assignedUsersCount: number;
    }>;
    create(dto: CreateModuleDto): Promise<{
        id: string;
        name: string;
        label: string;
        icon: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        assignedUsersCount: number;
    }>;
    reorder(dto: ReorderModulesDto): Promise<void>;
    update(id: string, dto: UpdateModuleDto): Promise<any>;
    remove(id: string): Promise<void>;
}
export {};
