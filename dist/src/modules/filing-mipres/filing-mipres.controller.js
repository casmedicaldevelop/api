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
exports.FilingMipresController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const filing_mipres_service_1 = require("./filing-mipres.service");
const list_filing_mipres_dto_1 = require("./dto/list-filing-mipres.dto");
const register_delivery_dto_1 = require("./dto/register-delivery.dto");
const update_radicacion_dto_1 = require("./dto/update-radicacion.dto");
const drive_service_1 = require("../drive/drive.service");
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
let FilingMipresController = class FilingMipresController {
    service;
    drive;
    constructor(service, drive) {
        this.service = service;
        this.drive = drive;
    }
    findAll(dto) {
        return this.service.findAll(dto);
    }
    deliveredScheduleIds(prescriptionNumber) {
        return this.service.scheduleIdsWithDeliveries(prescriptionNumber);
    }
    deliveryTotals(prescriptionNumber) {
        return this.service.deliveryTotalsByPrescription(prescriptionNumber);
    }
    facturacionPrefill(prescriptionNumber) {
        return this.service.facturacionPrefillByPrescription(prescriptionNumber);
    }
    async export(dto, res) {
        const buffer = await this.service.exportAll(dto);
        res.setHeader('Content-Type', XLSX_MIME);
        res.setHeader('Content-Disposition', 'attachment; filename="registros-mipres.xlsx"');
        res.send(buffer);
    }
    async exportToDrive(dto) {
        const buffer = await this.service.exportAll(dto);
        const date = new Date().toISOString().slice(0, 10);
        return this.drive.uploadBuffer(buffer, `registros-mipres-${date}.xlsx`, XLSX_MIME);
    }
    findIdBySchedule(scheduleId) {
        return this.service.findIdBySchedule(scheduleId);
    }
    driveQuota() {
        return this.drive.getQuota();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    updateRadicacion(id, dto) {
        return this.service.updateRadicacion(id, dto);
    }
    assignShelfCode(id) {
        return this.service.assignShelfCode(id);
    }
    listDeliveries(id) {
        return this.service.listDeliveries(id);
    }
    registerDelivery(id, dto, req) {
        return this.service.registerDelivery(id, dto, req.user.sub);
    }
    filesRoot(id) {
        return this.service.filesRoot(id);
    }
    filesTree(id) {
        return this.service.filesTree(id);
    }
    createFolder(id, folderId, body) {
        return this.service.filesCreateFolder(id, folderId, body?.name);
    }
    uploadFile(id, folderId, file) {
        return this.service.filesUpload(id, folderId, file);
    }
    async fileContent(id, itemId, disposition, res) {
        const { stream, mimeType, name } = await this.service.filesContent(id, itemId);
        const mode = disposition === 'attachment' ? 'attachment' : 'inline';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `${mode}; filename="${encodeURIComponent(name)}"`);
        stream.pipe(res);
    }
    filesList(id, folderId) {
        return this.service.filesList(id, folderId);
    }
    deleteItem(id, itemId) {
        return this.service.filesDelete(id, itemId);
    }
};
exports.FilingMipresController = FilingMipresController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_filing_mipres_dto_1.ListFilingMipresDto]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('delivered-schedule-ids'),
    __param(0, (0, common_1.Query)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "deliveredScheduleIds", null);
__decorate([
    (0, common_1.Get)('delivery-totals'),
    __param(0, (0, common_1.Query)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "deliveryTotals", null);
__decorate([
    (0, common_1.Get)('facturacion-prefill'),
    __param(0, (0, common_1.Query)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "facturacionPrefill", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_filing_mipres_dto_1.ListFilingMipresDto, Object]),
    __metadata("design:returntype", Promise)
], FilingMipresController.prototype, "export", null);
__decorate([
    (0, common_1.Get)('export/drive'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_filing_mipres_dto_1.ListFilingMipresDto]),
    __metadata("design:returntype", Promise)
], FilingMipresController.prototype, "exportToDrive", null);
__decorate([
    (0, common_1.Get)('by-schedule/:scheduleId'),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "findIdBySchedule", null);
__decorate([
    (0, common_1.Get)('drive-quota'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "driveQuota", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/radicacion'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_radicacion_dto_1.UpdateRadicacionDto]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "updateRadicacion", null);
__decorate([
    (0, common_1.Post)(':id/shelf-code'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "assignShelfCode", null);
__decorate([
    (0, common_1.Get)(':id/deliveries'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "listDeliveries", null);
__decorate([
    (0, common_1.Post)(':id/deliveries'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_delivery_dto_1.RegisterDeliveryDto, Object]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "registerDelivery", null);
__decorate([
    (0, common_1.Get)(':id/files'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "filesRoot", null);
__decorate([
    (0, common_1.Get)(':id/files-tree'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "filesTree", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId/folders'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/files/:itemId/content'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('disposition')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], FilingMipresController.prototype, "fileContent", null);
__decorate([
    (0, common_1.Get)(':id/files/:folderId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "filesList", null);
__decorate([
    (0, common_1.Delete)(':id/files/:itemId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], FilingMipresController.prototype, "deleteItem", null);
exports.FilingMipresController = FilingMipresController = __decorate([
    (0, common_1.Controller)('filing-mipres'),
    __metadata("design:paramtypes", [filing_mipres_service_1.FilingMipresService,
        drive_service_1.DriveService])
], FilingMipresController);
//# sourceMappingURL=filing-mipres.controller.js.map