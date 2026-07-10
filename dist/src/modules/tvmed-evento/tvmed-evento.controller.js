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
exports.TvMedEventoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tvmed_evento_service_1 = require("./tvmed-evento.service");
const create_tvmed_evento_dto_1 = require("./dto/create-tvmed-evento.dto");
const update_tvmed_evento_dto_1 = require("./dto/update-tvmed-evento.dto");
const list_tvmed_evento_dto_1 = require("./dto/list-tvmed-evento.dto");
const update_massive_tvmed_evento_dto_1 = require("./dto/update-massive-tvmed-evento.dto");
let TvMedEventoController = class TvMedEventoController {
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
exports.TvMedEventoController = TvMedEventoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_tvmed_evento_dto_1.ListTvMedEventoDto]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_tvmed_evento.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvMedEventoController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)('update/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_actualizacion_tvmed_evento.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvMedEventoController.prototype, "getUpdateTemplate", null);
__decorate([
    (0, common_1.Get)('by-cum/:cum'),
    __param(0, (0, common_1.Param)('cum')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "findByCum", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tvmed_evento_dto_1.CreateTvMedEventoDto]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tvmed_evento_dto_1.UpdateTvMedEventoDto]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "bulkUpload", null);
__decorate([
    (0, common_1.Post)('update/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "previewUpdate", null);
__decorate([
    (0, common_1.Post)('update/apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_massive_tvmed_evento_dto_1.ApplyUpdateDto]),
    __metadata("design:returntype", void 0)
], TvMedEventoController.prototype, "applyUpdate", null);
__decorate([
    (0, common_1.Post)('update/missing-template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="faltantes_tvmed_evento.xlsx"'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_massive_tvmed_evento_dto_1.MissingTemplateDto]),
    __metadata("design:returntype", common_1.StreamableFile)
], TvMedEventoController.prototype, "missingTemplate", null);
exports.TvMedEventoController = TvMedEventoController = __decorate([
    (0, common_1.Controller)('tvmed-evento'),
    __metadata("design:paramtypes", [tvmed_evento_service_1.TvMedEventoService])
], TvMedEventoController);
//# sourceMappingURL=tvmed-evento.controller.js.map