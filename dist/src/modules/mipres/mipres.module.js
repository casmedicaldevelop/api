"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MipresModule = void 0;
const common_1 = require("@nestjs/common");
const mipres_controller_1 = require("./mipres.controller");
const mipres_service_1 = require("./mipres.service");
const company_module_1 = require("../company/company.module");
const users_module_1 = require("../users/users.module");
let MipresModule = class MipresModule {
};
exports.MipresModule = MipresModule;
exports.MipresModule = MipresModule = __decorate([
    (0, common_1.Module)({
        imports: [company_module_1.CompanyModule, users_module_1.UsersModule],
        controllers: [mipres_controller_1.MipresController],
        providers: [mipres_service_1.MipresService],
    })
], MipresModule);
//# sourceMappingURL=mipres.module.js.map