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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const drive_service_1 = require("../drive/drive.service");
const create_service_user_dto_1 = require("./dto/create-service-user.dto");
const update_service_user_dto_1 = require("./dto/update-service-user.dto");
const list_service_users_dto_1 = require("./dto/list-service-users.dto");
let UsersController = class UsersController {
    usersService;
    drive;
    constructor(usersService, drive) {
        this.usersService = usersService;
        this.drive = drive;
    }
    findAll(dto) {
        return this.usersService.findAll(dto);
    }
    getTemplate() {
        const buffer = this.usersService.getTemplate();
        return new common_1.StreamableFile(buffer);
    }
    driveQuota() {
        return this.drive.getQuota();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    create(dto) {
        return this.usersService.create(dto);
    }
    update(id, dto) {
        return this.usersService.update(id, dto);
    }
    bulkImport(file) {
        return this.usersService.bulkImport(file);
    }
    filesRoot(id) {
        return this.usersService.filesRoot(id);
    }
    filesTree(id) {
        return this.usersService.filesTree(id);
    }
    createFolder(id, folderId, body) {
        return this.usersService.filesCreateFolder(id, folderId, body?.name);
    }
    uploadFile(id, folderId, file) {
        return this.usersService.filesUpload(id, folderId, file);
    }
    async fileContent(id, itemId, disposition, res) {
        const { stream, mimeType, name } = await this.usersService.filesContent(id, itemId);
        const mode = disposition === 'attachment' ? 'attachment' : 'inline';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `${mode}; filename="${encodeURIComponent(name)}"`);
        stream.pipe(res);
    }
    filesList(id, folderId) {
        return this.usersService.filesList(id, folderId);
    }
    deleteItem(id, itemId) {
        return this.usersService.filesDelete(id, itemId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_service_users_dto_1.ListServiceUsersDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_usuarios.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], UsersController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)('drive-quota'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "driveQuota", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_user_dto_1.CreateServiceUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_user_dto_1.UpdateServiceUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "bulkImport", null);
__decorate([
    (0, common_1.Get)(':id/files'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "filesRoot", null);
__decorate([
    (0, common_1.Get)(':id/files-tree'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "filesTree", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId/folders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/files/:itemId/content'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('disposition')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "fileContent", null);
__decorate([
    (0, common_1.Get)(':id/files/:folderId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "filesList", null);
__decorate([
    (0, common_1.Delete)(':id/files/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteItem", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        drive_service_1.DriveService])
], UsersController);
//# sourceMappingURL=users.controller.js.map