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
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const providers_service_1 = require("./providers.service");
const update_provider_dto_1 = require("./dto/update-provider.dto");
const list_provider_products_dto_1 = require("./dto/list-provider-products.dto");
const update_provider_product_dto_1 = require("./dto/update-provider-product.dto");
let ProvidersController = class ProvidersController {
    providersService;
    constructor(providersService) {
        this.providersService = providersService;
    }
    findAll() {
        return this.providersService.findAll();
    }
    findOne(id) {
        return this.providersService.findOne(id);
    }
    update(id, dto) {
        return this.providersService.update(id, dto);
    }
    async getTemplate(id) {
        const provider = await this.providersService.findOne(id);
        const buffer = this.providersService.getTemplate(provider.name);
        return new common_1.StreamableFile(buffer);
    }
    findProducts(id, dto) {
        return this.providersService.findProducts(id, dto);
    }
    findProduct(id, code) {
        return this.providersService.findProduct(id, code);
    }
    updateProduct(id, code, dto) {
        return this.providersService.updateProduct(id, code, dto);
    }
    bulkUpload(id, file, mode) {
        if (mode !== 'upload' && mode !== 'update')
            mode = 'update';
        return this.providersService.bulkUpload(id, file, mode);
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_provider_dto_1.UpdateProviderDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/products/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_proveedor.xlsx"'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, list_provider_products_dto_1.ListProviderProductsDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Get)(':id/products/:code'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findProduct", null);
__decorate([
    (0, common_1.Patch)(':id/products/:code'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('code')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, update_provider_product_dto_1.UpdateProviderProductDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)(':id/products/bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "bulkUpload", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map