"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilingMipresModule = void 0;
const common_1 = require("@nestjs/common");
const filing_mipres_controller_1 = require("./filing-mipres.controller");
const filing_mipres_service_1 = require("./filing-mipres.service");
const drive_module_1 = require("../drive/drive.module");
let FilingMipresModule = class FilingMipresModule {
};
exports.FilingMipresModule = FilingMipresModule;
exports.FilingMipresModule = FilingMipresModule = __decorate([
    (0, common_1.Module)({
        imports: [drive_module_1.DriveModule],
        controllers: [filing_mipres_controller_1.FilingMipresController],
        providers: [filing_mipres_service_1.FilingMipresService],
        exports: [filing_mipres_service_1.FilingMipresService],
    })
], FilingMipresModule);
//# sourceMappingURL=filing-mipres.module.js.map