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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const list_products_dto_1 = require("./dto/list-products.dto");
const assign_cum_provider1_dto_1 = require("./dto/assign-cum-provider1.dto");
const skip_cum_provider1_dto_1 = require("./dto/skip-cum-provider1.dto");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(dto) {
        return this.productsService.findAll(dto);
    }
    getTemplate() {
        const buffer = this.productsService.getTemplate();
        return new common_1.StreamableFile(buffer);
    }
    getCumPendingProvider1() {
        return this.productsService.getCumPendingProvider1();
    }
    getCumSuggestionsProvider1(q) {
        return this.productsService.getCumSuggestionsProvider1(q ?? '');
    }
    assignCumProvider1(dto) {
        return this.productsService.assignCumProvider1(dto);
    }
    skipCumProvider1(dto) {
        return this.productsService.skipCumProvider1(dto);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
    bulkUpload(file) {
        return this.productsService.bulkUpload(file);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_products_dto_1.ListProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('bulk/template'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="plantilla_productos.xlsx"'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], ProductsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)('cum-matching/provider1/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCumPendingProvider1", null);
__decorate([
    (0, common_1.Get)('cum-matching/provider1/suggestions'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCumSuggestionsProvider1", null);
__decorate([
    (0, common_1.Post)('cum-matching/provider1/assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_cum_provider1_dto_1.AssignCumProvider1Dto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "assignCumProvider1", null);
__decorate([
    (0, common_1.Post)('cum-matching/provider1/skip'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [skip_cum_provider1_dto_1.SkipCumProvider1Dto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "skipCumProvider1", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "bulkUpload", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map