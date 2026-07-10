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
exports.TvDataController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tv_data_service_1 = require("./tv-data.service");
const create_tv_data_dto_1 = require("./dto/create-tv-data.dto");
const update_tv_data_dto_1 = require("./dto/update-tv-data.dto");
const list_tv_data_dto_1 = require("./dto/list-tv-data.dto");
let TvDataController = class TvDataController {
    tvDataService;
    constructor(tvDataService) {
        this.tvDataService = tvDataService;
    }
    findAll(dto) {
        return this.tvDataService.findAll(dto);
    }
    getTemplate() {
        const buffer = this.tvDataService.getTemplate();
        return new common_1.StreamableFile(buffer);
    }
    findOne(id) {
        return this.tvDataService.findOne(id);
    }
    create(dto) {
        return this.tvDataService.create(dto);
    }
    update(id, dto) {
        return this.tvDataService.update(id, dto);
    }
    remove(id) {
        return this.tvDataService.remove(id);
    }
    bulkUpload(file) {
        return this.tvDataService.bulkUpload(file);
    }
};
exports.TvDataController = TvDataController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_tv_data_dto_1.ListTvDataDto]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_tvmed.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], TvDataController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tv_data_dto_1.CreateTvDataDto]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tv_data_dto_1.UpdateTvDataDto]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TvDataController.prototype, "bulkUpload", null);
exports.TvDataController = TvDataController = __decorate([
    (0, common_1.Controller)('tv-data'),
    __metadata("design:paramtypes", [tv_data_service_1.TvDataService])
], TvDataController);
//# sourceMappingURL=tv-data.controller.js.map