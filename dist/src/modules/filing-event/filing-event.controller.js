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
exports.FilingEventController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const filing_event_service_1 = require("./filing-event.service");
const drive_service_1 = require("../drive/drive.service");
const create_filing_event_dto_1 = require("./dto/create-filing-event.dto");
const list_filing_event_dto_1 = require("./dto/list-filing-event.dto");
const register_delivery_event_dto_1 = require("./dto/register-delivery-event.dto");
const register_delivery_bulk_event_dto_1 = require("./dto/register-delivery-bulk-event.dto");
const set_radicado_event_dto_1 = require("./dto/set-radicado-event.dto");
const update_prescription_event_dto_1 = require("./dto/update-prescription-event.dto");
const set_invoice_date_event_dto_1 = require("./dto/set-invoice-date-event.dto");
let FilingEventController = class FilingEventController {
    service;
    drive;
    constructor(service, drive) {
        this.service = service;
        this.drive = drive;
    }
    driveQuota() {
        return this.drive.getQuota();
    }
    list(dto) {
        return this.service.list(dto);
    }
    findByAuthorization(code) {
        return this.service.findByAuthorization(code);
    }
    async export(dto, res) {
        const buffer = await this.service.exportAll(dto);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="registros-evento.xlsx"');
        res.end(buffer);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    setRadicado(id, dto) {
        return this.service.setRadicado(id, dto.filingCode);
    }
    updatePrescription(itemId, dto) {
        return this.service.updatePrescription(itemId, dto);
    }
    assignShelfCode(id) {
        return this.service.assignShelfCode(id);
    }
    listDeliveries(itemId) {
        return this.service.listDeliveries(itemId);
    }
    listFilingDeliveries(id) {
        return this.service.listFilingDeliveries(id);
    }
    setBatchInvoiceDate(id, batch, dto) {
        return this.service.setBatchInvoiceDate(id, batch, dto.invoiceDate);
    }
    registerDelivery(itemId, dto, req) {
        return this.service.registerDelivery(itemId, dto, req.user.sub);
    }
    registerDeliveryBulk(id, dto, req) {
        return this.service.registerDeliveryBulk(id, dto.lines, req.user.sub);
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
    extractPdf(file) {
        return this.service.extractPdf(file);
    }
    create(dto) {
        return this.service.create(dto);
    }
};
exports.FilingEventController = FilingEventController;
__decorate([
    (0, common_1.Get)('drive-quota'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "driveQuota", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_filing_event_dto_1.ListFilingEventDto]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('by-authorization/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "findByAuthorization", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_filing_event_dto_1.ListFilingEventDto, Object]),
    __metadata("design:returntype", Promise)
], FilingEventController.prototype, "export", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/radicado'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, set_radicado_event_dto_1.SetRadicadoEventDto]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "setRadicado", null);
__decorate([
    (0, common_1.Patch)('items/:itemId/prescription'),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_prescription_event_dto_1.UpdatePrescriptionEventDto]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "updatePrescription", null);
__decorate([
    (0, common_1.Post)(':id/shelf-code'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "assignShelfCode", null);
__decorate([
    (0, common_1.Get)('items/:itemId/deliveries'),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "listDeliveries", null);
__decorate([
    (0, common_1.Get)(':id/deliveries'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "listFilingDeliveries", null);
__decorate([
    (0, common_1.Patch)(':id/batches/:batch/invoice-date'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('batch')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, set_invoice_date_event_dto_1.SetInvoiceDateEventDto]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "setBatchInvoiceDate", null);
__decorate([
    (0, common_1.Post)('items/:itemId/deliveries'),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_delivery_event_dto_1.RegisterDeliveryEventDto, Object]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "registerDelivery", null);
__decorate([
    (0, common_1.Post)(':id/deliveries'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_delivery_bulk_event_dto_1.RegisterDeliveryBulkEventDto, Object]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "registerDeliveryBulk", null);
__decorate([
    (0, common_1.Get)(':id/files'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "filesRoot", null);
__decorate([
    (0, common_1.Get)(':id/files-tree'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "filesTree", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId/folders'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Post)(':id/files/:folderId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/files/:itemId/content'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('disposition')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], FilingEventController.prototype, "fileContent", null);
__decorate([
    (0, common_1.Get)(':id/files/:folderId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "filesList", null);
__decorate([
    (0, common_1.Delete)(':id/files/:itemId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)('ocr'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 20 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "extractPdf", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_filing_event_dto_1.CreateFilingEventDto]),
    __metadata("design:returntype", void 0)
], FilingEventController.prototype, "create", null);
exports.FilingEventController = FilingEventController = __decorate([
    (0, common_1.Controller)('filing-event'),
    __metadata("design:paramtypes", [filing_event_service_1.FilingEventService,
        drive_service_1.DriveService])
], FilingEventController);
//# sourceMappingURL=filing-event.controller.js.map