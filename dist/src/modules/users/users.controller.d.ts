import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { DriveService } from '../drive/drive.service';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { ListServiceUsersDto } from './dto/list-service-users.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly drive;
    constructor(usersService: UsersService, drive: DriveService);
    findAll(dto: ListServiceUsersDto): Promise<{
        data: {
            id: string;
            phone: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            address: string | null;
            documentType: import("@prisma/client").$Enums.DocumentType | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            firstName: string;
            secondName: string | null;
            firstSurname: string;
            secondSurname: string | null;
            birthDate: Date | null;
            birthDateApproximate: boolean;
            healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
            department: string | null;
            city: string | null;
            neighborhood: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTemplate(): StreamableFile;
    driveQuota(): Promise<{
        limitBytes: number | null;
        usageBytes: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        documentType: import("@prisma/client").$Enums.DocumentType | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        firstName: string;
        secondName: string | null;
        firstSurname: string;
        secondSurname: string | null;
        birthDate: Date | null;
        birthDateApproximate: boolean;
        healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
        department: string | null;
        city: string | null;
        neighborhood: string | null;
    }>;
    create(dto: CreateServiceUserDto): Promise<{
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        documentType: import("@prisma/client").$Enums.DocumentType | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        firstName: string;
        secondName: string | null;
        firstSurname: string;
        secondSurname: string | null;
        birthDate: Date | null;
        birthDateApproximate: boolean;
        healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
        department: string | null;
        city: string | null;
        neighborhood: string | null;
    }>;
    update(id: string, dto: UpdateServiceUserDto): Promise<{
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        documentType: import("@prisma/client").$Enums.DocumentType | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        firstName: string;
        secondName: string | null;
        firstSurname: string;
        secondSurname: string | null;
        birthDate: Date | null;
        birthDateApproximate: boolean;
        healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
        department: string | null;
        city: string | null;
        neighborhood: string | null;
    }>;
    bulkImport(file: Express.Multer.File): Promise<{
        inserted: number;
    }>;
    filesRoot(id: string): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: import("../drive/drive.service").DriveItem[];
    }>;
    filesTree(id: string): Promise<{
        rootId: string;
        tree: import("../drive/drive.service").FolderNode[];
    }>;
    createFolder(id: string, folderId: string, body: {
        name: string;
    }): Promise<import("../drive/drive.service").DriveItem>;
    uploadFile(id: string, folderId: string, file: {
        originalname: string;
        mimetype: string;
        buffer: Buffer;
    }): Promise<import("../drive/drive.service").DriveItem>;
    fileContent(id: string, itemId: string, disposition: string, res: Response): Promise<void>;
    filesList(id: string, folderId: string): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: import("../drive/drive.service").DriveItem[];
    }>;
    deleteItem(id: string, itemId: string): Promise<{
        ok: true;
    }>;
}
