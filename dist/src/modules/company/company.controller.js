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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("./company.service");
const upsert_company_dto_1 = require("./dto/upsert-company.dto");
const update_mipres_dto_1 = require("./dto/update-mipres.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let CompanyController = class CompanyController {
    companyService;
    constructor(companyService) {
        this.companyService = companyService;
    }
    getCompany() {
        return this.companyService.getCompany();
    }
    upsertCompany(dto) {
        return this.companyService.upsertCompany(dto);
    }
    updateMipres(dto) {
        return this.companyService.updateMipres(dto);
    }
    async refreshMipresToken() {
        await this.companyService.generateMipresToken();
        return this.companyService.getCompany();
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "getCompany", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_company_dto_1.UpsertCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "upsertCompany", null);
__decorate([
    (0, common_1.Patch)('mipres'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_mipres_dto_1.UpdateMipresDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "updateMipres", null);
__decorate([
    (0, common_1.Post)('mipres/refresh-token'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "refreshMipresToken", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map