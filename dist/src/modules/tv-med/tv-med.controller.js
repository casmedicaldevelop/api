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
exports.TvMedController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tv_med_service_1 = require("./tv-med.service");
const create_tv_med_dto_1 = require("./dto/create-tv-med.dto");
const update_tv_med_dto_1 = require("./dto/update-tv-med.dto");
const list_tv_med_dto_1 = require("./dto/list-tv-med.dto");
let TvMedController = class TvMedController {
    tvMedService;
    constructor(tvMedService) {
        this.tvMedService = tvMedService;
    }
    findAll(dto) {
        return this.tvMedService.findAll(dto);
    }
    getTemplate() {
        const buffer = this.tvMedService.getTemplate();
        return new common_1.StreamableFile(buffer);
    }
    findOne(id) {
        return this.tvMedService.findOne(id);
    }
    create(dto) {
        return this.tvMedService.create(dto);
    }
    update(id, dto) {
        return this.tvMedService.update(id, dto);
    }
    remove(id) {
        return this.tvMedService.remove(id);
    }
    bulkUpload(file) {
        return this.tvMedService.bulkUpload(file);
    }
};
exports.TvMedController = TvMedController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_tv_med_dto_1.ListTvMedDto]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_tvmed.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvMedController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tv_med_dto_1.CreateTvMedDto]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tv_med_dto_1.UpdateTvMedDto]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvMedController.prototype, "bulkUpload", null);
exports.TvMedController = TvMedController = __decorate([
    (0, common_1.Controller)('tv-med'),
    __metadata("design:paramtypes", [tv_med_service_1.TvMedService])
], TvMedController);
//# sourceMappingURL=tv-med.controller.js.map