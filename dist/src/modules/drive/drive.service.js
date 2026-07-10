"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const node_stream_1 = require("node:stream");
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const FOLDER_NAME = 'FILING_MIPRES';
const USERS_FOLDER_NAME = 'USERS';
const EVENT_FOLDER_NAME = 'FILING_EVENT';
let DriveService = class DriveService {
    logger = new common_1.Logger('DriveService');
    drive;
    folderId;
    usersFolderId = null;
    eventFolderId = null;
    folderInflight = null;
    usersFolderInflight = null;
    eventFolderInflight = null;
    childInflight = new Map();
    constructor(config) {
        const clientId = config.get('GOOGLE_CLIENT_ID');
        const clientSecret = config.get('GOOGLE_CLIENT_SECRET');
        const refreshToken = config.get('GOOGLE_REFRESH_TOKEN');
        this.folderId = config.get('GOOGLE_DRIVE_FOLDER_ID') ?? null;
        if (clientId && clientSecret && refreshToken) {
            const oauth2 = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
            oauth2.setCredentials({ refresh_token: refreshToken });
            this.drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2 });
        }
        else {
            this.drive = null;
            this.logger.warn('Google Drive sin credenciales (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN). Subidas deshabilitadas.');
        }
    }
    client() {
        if (!this.drive) {
            throw new common_1.InternalServerErrorException('Google Drive no está configurado (faltan credenciales en el servidor).');
        }
        return this.drive;
    }
    async ensureFolder() {
        if (this.folderId)
            return this.folderId;
        if (this.folderInflight)
            return this.folderInflight;
        this.folderInflight = (async () => {
            const drive = this.client();
            const found = await drive.files.list({
                q: `mimeType='${FOLDER_MIME}' and name='${FOLDER_NAME}' and trashed=false`,
                fields: 'files(id)',
                spaces: 'drive',
                pageSize: 1,
            });
            const existing = found.data.files?.[0]?.id;
            if (existing) {
                this.folderId = existing;
                return existing;
            }
            const created = await drive.files.create({
                requestBody: { name: FOLDER_NAME, mimeType: FOLDER_MIME },
                fields: 'id',
            });
            if (!created.data.id) {
                throw new common_1.InternalServerErrorException('No se pudo crear la carpeta en Google Drive.');
            }
            this.folderId = created.data.id;
            return created.data.id;
        })().finally(() => {
            this.folderInflight = null;
        });
        return this.folderInflight;
    }
    async uploadBuffer(buffer, filename, mimeType) {
        const drive = this.client();
        try {
            const folderId = await this.ensureFolder();
            const res = await drive.files.create({
                requestBody: { name: filename, parents: [folderId] },
                media: { mimeType, body: node_stream_1.Readable.from(buffer) },
                fields: 'id, webViewLink',
            });
            return { id: res.data.id ?? '', webViewLink: res.data.webViewLink ?? '' };
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async ensureRadicadoRoot(filingId) {
        const parent = await this.ensureFolder();
        return this.ensureChildFolder(parent, String(filingId));
    }
    async ensureUsersFolder() {
        if (this.usersFolderId)
            return this.usersFolderId;
        if (this.usersFolderInflight)
            return this.usersFolderInflight;
        this.usersFolderInflight = (async () => {
            const drive = this.client();
            const found = await drive.files.list({
                q: `mimeType='${FOLDER_MIME}' and name='${USERS_FOLDER_NAME}' and 'root' in parents and trashed=false`,
                fields: 'files(id)',
                spaces: 'drive',
                orderBy: 'createdTime',
                pageSize: 1,
            });
            const existing = found.data.files?.[0]?.id;
            if (existing) {
                this.usersFolderId = existing;
                return existing;
            }
            const created = await drive.files.create({
                requestBody: { name: USERS_FOLDER_NAME, mimeType: FOLDER_MIME },
                fields: 'id',
            });
            if (!created.data.id) {
                throw new common_1.InternalServerErrorException('No se pudo crear la carpeta USERS en Google Drive.');
            }
            this.usersFolderId = created.data.id;
            return created.data.id;
        })().finally(() => {
            this.usersFolderInflight = null;
        });
        return this.usersFolderInflight;
    }
    async ensureUserRoot(userId) {
        const safe = (userId ?? '').trim();
        if (!safe)
            throw new common_1.BadRequestException('Identificación de usuario inválida.');
        const parent = await this.ensureUsersFolder();
        return this.ensureChildFolder(parent, safe);
    }
    async ensureEventFolder() {
        if (this.eventFolderId)
            return this.eventFolderId;
        if (this.eventFolderInflight)
            return this.eventFolderInflight;
        this.eventFolderInflight = (async () => {
            const drive = this.client();
            const found = await drive.files.list({
                q: `mimeType='${FOLDER_MIME}' and name='${EVENT_FOLDER_NAME}' and 'root' in parents and trashed=false`,
                fields: 'files(id)',
                spaces: 'drive',
                orderBy: 'createdTime',
                pageSize: 1,
            });
            const existing = found.data.files?.[0]?.id;
            if (existing) {
                this.eventFolderId = existing;
                return existing;
            }
            const created = await drive.files.create({
                requestBody: { name: EVENT_FOLDER_NAME, mimeType: FOLDER_MIME },
                fields: 'id',
            });
            if (!created.data.id) {
                throw new common_1.InternalServerErrorException('No se pudo crear la carpeta FILING_EVENT en Google Drive.');
            }
            this.eventFolderId = created.data.id;
            return created.data.id;
        })().finally(() => {
            this.eventFolderInflight = null;
        });
        return this.eventFolderInflight;
    }
    async ensureEventRoot(authorizationCode) {
        const safe = (authorizationCode ?? '').trim();
        if (!safe)
            throw new common_1.BadRequestException('Código de autorización inválido.');
        const parent = await this.ensureEventFolder();
        return this.ensureChildFolder(parent, safe);
    }
    async ensureChildFolder(parentId, name) {
        const key = `${parentId}::${name}`;
        const pending = this.childInflight.get(key);
        if (pending)
            return pending;
        const task = (async () => {
            const drive = this.client();
            const safe = name.replace(/'/g, "\\'");
            const found = await drive.files.list({
                q: `mimeType='${FOLDER_MIME}' and name='${safe}' and '${parentId}' in parents and trashed=false`,
                fields: 'files(id)',
                spaces: 'drive',
                orderBy: 'createdTime',
                pageSize: 1,
            });
            const existing = found.data.files?.[0]?.id;
            if (existing)
                return existing;
            const created = await drive.files.create({
                requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
                fields: 'id',
            });
            if (!created.data.id) {
                throw new common_1.InternalServerErrorException('No se pudo crear la carpeta en Google Drive.');
            }
            return created.data.id;
        })().finally(() => {
            this.childInflight.delete(key);
        });
        this.childInflight.set(key, task);
        return task;
    }
    async listChildren(folderId) {
        const drive = this.client();
        try {
            const res = await drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id,name,mimeType,modifiedTime,size)',
                orderBy: 'folder,name',
                spaces: 'drive',
                pageSize: 1000,
            });
            return (res.data.files ?? []).map((f) => this.toItem(f));
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async createFolder(parentId, name) {
        const drive = this.client();
        try {
            const res = await drive.files.create({
                requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
                fields: 'id,name,mimeType,modifiedTime,size',
            });
            return this.toItem(res.data);
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async uploadToFolder(parentId, buffer, filename, mimeType) {
        const drive = this.client();
        try {
            const res = await drive.files.create({
                requestBody: { name: filename, parents: [parentId] },
                media: { mimeType, body: node_stream_1.Readable.from(buffer) },
                fields: 'id,name,mimeType,modifiedTime,size',
            });
            return this.toItem(res.data);
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async deleteItem(id) {
        const drive = this.client();
        try {
            await drive.files.delete({ fileId: id });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async getStream(id) {
        const drive = this.client();
        try {
            const meta = await drive.files.get({ fileId: id, fields: 'name,mimeType' });
            const res = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' });
            return {
                stream: res.data,
                mimeType: meta.data.mimeType ?? 'application/octet-stream',
                name: meta.data.name ?? 'archivo',
            };
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async isWithinTree(itemId, rootId) {
        if (itemId === rootId)
            return true;
        const drive = this.client();
        let current = itemId;
        for (let i = 0; i < 50; i++) {
            const res = await drive.files.get({ fileId: current, fields: 'id,parents' });
            const parents = res.data.parents ?? [];
            if (parents.includes(rootId))
                return true;
            if (parents.length === 0)
                return false;
            current = parents[0];
        }
        return false;
    }
    async pathTo(folderId, rootId) {
        const drive = this.client();
        const chain = [];
        let current = folderId;
        for (let i = 0; i < 50; i++) {
            const res = await drive.files.get({ fileId: current, fields: 'id,name,parents' });
            chain.push({ id: res.data.id ?? current, name: res.data.name ?? '' });
            if (current === rootId)
                break;
            const parents = res.data.parents ?? [];
            if (parents.length === 0)
                break;
            current = parents[0];
        }
        return chain.reverse();
    }
    toItem(f) {
        return {
            id: f.id ?? '',
            name: f.name ?? '',
            isFolder: f.mimeType === FOLDER_MIME,
            mimeType: f.mimeType ?? '',
            modifiedTime: f.modifiedTime ?? undefined,
            size: f.size ?? undefined,
        };
    }
    async listFolderTree(rootId) {
        const children = await this.listChildren(rootId);
        const folders = children.filter((c) => c.isFolder);
        const nodes = [];
        for (const f of folders) {
            nodes.push({ id: f.id, name: f.name, children: await this.listFolderTree(f.id) });
        }
        return nodes;
    }
    async getQuota() {
        const drive = this.client();
        try {
            const r = await drive.about.get({ fields: 'storageQuota' });
            const q = r.data.storageQuota ?? {};
            return {
                limitBytes: q.limit != null ? Number(q.limit) : null,
                usageBytes: Number(q.usage ?? 0),
            };
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    mapError(err) {
        const e = err;
        const msg = e?.message ?? '';
        const reason = e?.errors?.[0]?.reason ?? '';
        if (reason === 'invalid_grant' || msg.includes('invalid_grant')) {
            return new common_1.BadRequestException('Reautorizar Google Drive: el refresh token es inválido o expiró.');
        }
        if (reason === 'storageQuotaExceeded' || msg.includes('storageQuotaExceeded')) {
            return new common_1.BadRequestException('Google Drive sin espacio: la cuota fue excedida.');
        }
        this.logger.error(`Error subiendo a Drive: ${msg}`);
        return new common_1.InternalServerErrorException('No se pudo subir el archivo a Google Drive.');
    }
};
exports.DriveService = DriveService;
exports.DriveService = DriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DriveService);
//# sourceMappingURL=drive.service.js.map