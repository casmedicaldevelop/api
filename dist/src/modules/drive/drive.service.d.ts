import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
export interface DriveItem {
    id: string;
    name: string;
    isFolder: boolean;
    mimeType: string;
    modifiedTime?: string;
    size?: string;
    childCount?: number;
    folderSizeBytes?: number;
}
export interface FolderNode {
    id: string;
    name: string;
    children: FolderNode[];
}
export declare class DriveService {
    private readonly logger;
    private readonly drive;
    private folderId;
    private usersFolderId;
    private eventFolderId;
    private folderInflight;
    private usersFolderInflight;
    private eventFolderInflight;
    private readonly childInflight;
    constructor(config: ConfigService);
    private client;
    private ensureFolder;
    uploadBuffer(buffer: Buffer, filename: string, mimeType: string): Promise<{
        id: string;
        webViewLink: string;
    }>;
    ensureRadicadoRoot(filingId: number): Promise<string>;
    private ensureUsersFolder;
    ensureUserRoot(userId: string): Promise<string>;
    private ensureEventFolder;
    ensureEventRoot(authorizationCode: string): Promise<string>;
    private ensureChildFolder;
    listChildren(folderId: string): Promise<DriveItem[]>;
    createFolder(parentId: string, name: string): Promise<DriveItem>;
    uploadToFolder(parentId: string, buffer: Buffer, filename: string, mimeType: string): Promise<DriveItem>;
    deleteItem(id: string): Promise<void>;
    getStream(id: string): Promise<{
        stream: Readable;
        mimeType: string;
        name: string;
    }>;
    isWithinTree(itemId: string, rootId: string): Promise<boolean>;
    pathTo(folderId: string, rootId: string): Promise<Array<{
        id: string;
        name: string;
    }>>;
    private toItem;
    listFolderTree(rootId: string): Promise<FolderNode[]>;
    getQuota(): Promise<{
        limitBytes: number | null;
        usageBytes: number;
    }>;
    private mapError;
}
