import { PrismaService } from '../../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
export declare class SystemModulesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(isActive?: boolean): Promise<{
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
    delete(id: string): Promise<void>;
    update(id: string, dto: UpdateModuleDto): Promise<any>;
}
