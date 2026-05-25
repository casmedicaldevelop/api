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
var MipresTokenTask_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MipresTokenTask = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const company_service_1 = require("../company/company.service");
let MipresTokenTask = MipresTokenTask_1 = class MipresTokenTask {
    companyService;
    logger = new common_1.Logger(MipresTokenTask_1.name);
    constructor(companyService) {
        this.companyService = companyService;
    }
    async refreshMipresToken() {
        this.logger.log('Iniciando renovación automática del token MIPRES...');
        try {
            await this.companyService.generateMipresToken();
            this.logger.log('Token MIPRES renovado exitosamente');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error al renovar token MIPRES: ${message}`);
        }
    }
};
exports.MipresTokenTask = MipresTokenTask;
__decorate([
    (0, schedule_1.Cron)('30 7 * * *', { timeZone: 'America/Bogota' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MipresTokenTask.prototype, "refreshMipresToken", null);
exports.MipresTokenTask = MipresTokenTask = MipresTokenTask_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], MipresTokenTask);
//# sourceMappingURL=mipres-token.task.js.map