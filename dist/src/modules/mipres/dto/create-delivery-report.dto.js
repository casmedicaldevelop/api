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
exports.CreateDeliveryReportDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDeliveryReportDto {
    miPresEntregaId;
    deliveryId;
    valorEntregado;
}
exports.CreateDeliveryReportDto = CreateDeliveryReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryReportDto.prototype, "miPresEntregaId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryReportDto.prototype, "deliveryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'valorEntregado must contain digits only (no decimals, no separators)' }),
    __metadata("design:type", String)
], CreateDeliveryReportDto.prototype, "valorEntregado", void 0);
//# sourceMappingURL=create-delivery-report.dto.js.map