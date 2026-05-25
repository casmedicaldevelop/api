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
exports.CreateFacturacionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateFacturacionDto {
    NoPrescripcion;
    TipoTec;
    ConTec;
    TipoIDPaciente;
    NoIDPaciente;
    NoEntrega;
    NoSubEntrega;
    NoFactura;
    NoIDEPS;
    CodEPS;
    CodSerTecAEntregado;
    CantUnMinDis;
    ValorUnitFacturado;
    ValorTotFacturado;
    CuotaModer;
    Copago;
}
exports.CreateFacturacionDto = CreateFacturacionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "NoPrescripcion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "TipoTec", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFacturacionDto.prototype, "ConTec", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "TipoIDPaciente", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "NoIDPaciente", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFacturacionDto.prototype, "NoEntrega", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFacturacionDto.prototype, "NoSubEntrega", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^[A-Za-z0-9_-]+$/, {
        message: 'NoFactura must be alphanumeric (letters, digits, _ or -)',
    }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "NoFactura", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "NoIDEPS", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "CodEPS", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "CodSerTecAEntregado", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'CantUnMinDis must be digits only' }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "CantUnMinDis", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{1,10}$/, {
        message: 'ValorUnitFacturado must be 1-10 digits (no decimals, no separators)',
    }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "ValorUnitFacturado", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'ValorTotFacturado must be digits only' }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "ValorTotFacturado", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'CuotaModer must be digits only' }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "CuotaModer", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'Copago must be digits only' }),
    __metadata("design:type", String)
], CreateFacturacionDto.prototype, "Copago", void 0);
//# sourceMappingURL=create-facturacion.dto.js.map