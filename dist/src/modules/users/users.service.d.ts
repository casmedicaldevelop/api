import { PrismaService } from '../../prisma/prisma.service';
import { DriveService, type DriveItem, type FolderNode } from '../drive/drive.service';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { ListServiceUsersDto } from './dto/list-service-users.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly drive;
    constructor(prisma: PrismaService, drive: DriveService);
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
    findOneOrNull(id: string): Promise<{
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
    } | null>;
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
    getTemplate(): Buffer;
    private filesRootId;
    private assertInTree;
    private enrichFolders;
    filesRoot(userId: string): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: DriveItem[];
    }>;
    filesTree(userId: string): Promise<{
        rootId: string;
        tree: FolderNode[];
    }>;
    filesList(userId: string, folderId: string): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: DriveItem[];
    }>;
    filesCreateFolder(userId: string, folderId: string, name: string): Promise<DriveItem>;
    filesUpload(userId: string, folderId: string, file: {
        originalname: string;
        mimetype: string;
        buffer: Buffer;
    } | undefined): Promise<DriveItem>;
    filesDelete(userId: string, itemId: string): Promise<{
        ok: true;
    }>;
    filesContent(userId: string, itemId: string): Promise<{
        stream: import("stream").Readable;
        mimeType: string;
        name: string;
    }>;
}
