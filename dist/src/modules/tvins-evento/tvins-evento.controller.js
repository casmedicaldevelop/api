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
exports.TvInsEventoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tvins_evento_service_1 = require("./tvins-evento.service");
const create_tvins_evento_dto_1 = require("./dto/create-tvins-evento.dto");
const update_tvins_evento_dto_1 = require("./dto/update-tvins-evento.dto");
const list_tvins_evento_dto_1 = require("./dto/list-tvins-evento.dto");
const update_massive_tvins_evento_dto_1 = require("./dto/update-massive-tvins-evento.dto");
let TvInsEventoController = class TvInsEventoController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(dto) {
        return this.service.findAll(dto);
    }
    getTemplate() {
        return new common_1.StreamableFile(this.service.getTemplate());
    }
    getUpdateTemplate() {
        return new common_1.StreamableFile(this.service.getUpdateTemplate());
    }
    findByCum(cum) {
        return this.service.findByCum(cum);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    bulkUpload(file) {
        return this.service.bulkUpload(file);
    }
    previewUpdate(file) {
        return this.service.previewUpdate(file);
    }
    applyUpdate(dto) {
        return this.service.applyUpdate(dto.items);
    }
    missingTemplate(dto) {
        return new common_1.StreamableFile(this.service.getMissingTemplate(dto.rows));
    }
};
exports.TvInsEventoController = TvInsEventoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_tvins_evento_dto_1.ListTvInsEventoDto]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_tvins_evento.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvInsEventoController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)('update/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_actualizacion_tvins_evento.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvInsEventoController.prototype, "getUpdateTemplate", null);
__decorate([
    (0, common_1.Get)('by-cum/:cum'),
    __param(0, (0, common_1.Param)('cum')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "findByCum", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tvins_evento_dto_1.CreateTvInsEventoDto]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tvins_evento_dto_1.UpdateTvInsEventoDto]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "bulkUpload", null);
__decorate([
    (0, common_1.Post)('update/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "previewUpdate", null);
__decorate([
    (0, common_1.Post)('update/apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_massive_tvins_evento_dto_1.ApplyUpdateDto]),
    __metadata("design:returntype", void 0)
], TvInsEventoController.prototype, "applyUpdate", null);
__decorate([
    (0, common_1.Post)('update/missing-template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="faltantes_tvins_evento.xlsx"'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_massive_tvins_evento_dto_1.MissingTemplateDto]),
    __metadata("design:returntype", common_1.StreamableFile)
], TvInsEventoController.prototype, "missingTemplate", null);
exports.TvInsEventoController = TvInsEventoController = __decorate([
    (0, common_1.Controller)('tvins-evento'),
    __metadata("design:paramtypes", [tvins_evento_service_1.TvInsEventoService])
], TvInsEventoController);
//# sourceMappingURL=tvins-evento.controller.js.map