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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilingMipresCatalogController = void 0;
const common_1 = require("@nestjs/common");
const filing_mipres_catalog_service_1 = require("./filing-mipres-catalog.service");
let FilingMipresCatalogController = class FilingMipresCatalogController {
    service;
    constructor(service) {
        this.service = service;
    }
    listStatuses() {
        return this.service.listStatuses();
    }
    listSubstatuses() {
        return this.service.listSubstatuses();
    }
};
exports.FilingMipresCatalogController = FilingMipresCatalogController;
__decorate([
    (0, common_1.Get)('statuses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilingMipresCatalogController.prototype, "listStatuses", null);
__decorate([
    (0, common_1.Get)('substatuses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilingMipresCatalogController.prototype, "listSubstatuses", null);
exports.FilingMipresCatalogController = FilingMipresCatalogController = __decorate([
    (0, common_1.Controller)('filing-mipres/catalog'),
    __metadata("design:paramtypes", [filing_mipres_catalog_service_1.FilingMipresCatalogService])
], FilingMipresCatalogController);
//# sourceMappingURL=filing-mipres-catalog.controller.js.map