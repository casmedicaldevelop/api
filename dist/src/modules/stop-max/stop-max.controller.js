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
exports.StopMaxController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const stop_max_service_1 = require("./stop-max.service");
const create_stop_max_dto_1 = require("./dto/create-stop-max.dto");
const update_stop_max_dto_1 = require("./dto/update-stop-max.dto");
const list_stop_max_dto_1 = require("./dto/list-stop-max.dto");
let StopMaxController = class StopMaxController {
    stopMaxService;
    constructor(stopMaxService) {
        this.stopMaxService = stopMaxService;
    }
    findAll(dto) {
        return this.stopMaxService.findAll(dto);
    }
    getTemplate() {
        const buffer = this.stopMaxService.getTemplate();
        return new common_1.StreamableFile(buffer);
    }
    findOne(id) {
        return this.stopMaxService.findOne(id);
    }
    create(dto) {
        return this.stopMaxService.create(dto);
    }
    update(id, dto) {
        return this.stopMaxService.update(id, dto);
    }
    remove(id) {
        return this.stopMaxService.remove(id);
    }
    bulkUpload(file) {
        return this.stopMaxService.bulkUpload(file);
    }
};
exports.StopMaxController = StopMaxController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_stop_max_dto_1.ListStopMaxDto]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_topes_maximos.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], StopMaxController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stop_max_dto_1.CreateStopMaxDto]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stop_max_dto_1.UpdateStopMaxDto]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StopMaxController.prototype, "bulkUpload", null);
exports.StopMaxController = StopMaxController = __decorate([
    (0, common_1.Controller)('stop-max'),
    __metadata("design:paramtypes", [stop_max_service_1.StopMaxService])
], StopMaxController);
//# sourceMappingURL=stop-max.controller.js.map