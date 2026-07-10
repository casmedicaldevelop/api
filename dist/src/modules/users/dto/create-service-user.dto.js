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
exports.CreateServiceUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const toUpper = ({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value;
class CreateServiceUserDto {
    id;
    documentType;
    gender;
    firstName;
    secondName;
    firstSurname;
    secondSurname;
    phone;
    email;
    birthDate;
    birthDateApproximate;
    healthcareRegime;
    department;
    city;
    neighborhood;
    address;
    description;
}
exports.CreateServiceUserDto = CreateServiceUserDto;
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La cédula es requerida' }),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'La cédula solo debe contener dígitos' }),
    (0, class_validator_1.MaxLength)(20, { message: 'La cédula no puede superar 20 dígitos' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.DocumentType, { message: 'Tipo de documento inválido' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "documentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Gender, { message: 'Género inválido' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El primer nombre es requerido' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "secondName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El primer apellido es requerido' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "firstSurname", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "secondSurname", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El teléfono es requerido' }),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de nacimiento no es válida' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateServiceUserDto.prototype, "birthDateApproximate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HealthcareRegime, { message: 'Régimen de salud inválido' }),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "healthcareRegime", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "department", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Transform)(toUpper),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateServiceUserDto.prototype, "description", void 0);
//# sourceMappingURL=create-service-user.dto.js.map