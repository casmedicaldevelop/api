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
exports.MipresController = void 0;
const common_1 = require("@nestjs/common");
const mipres_service_1 = require("./mipres.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const create_delivery_report_dto_1 = require("./dto/create-delivery-report.dto");
const create_facturacion_dto_1 = require("./dto/create-facturacion.dto");
let MipresController = class MipresController {
    mipresService;
    constructor(mipresService) {
        this.mipresService = mipresService;
    }
    getRoutingsByPrescription(prescriptionNumber) {
        return this.mipresService.getRoutingsByPrescription(prescriptionNumber);
    }
    getWorkspace(prescriptionNumber) {
        return this.mipresService.getPrescriptionWorkspace(prescriptionNumber);
    }
    createSchedule(body) {
        return this.mipresService.createSchedule(body);
    }
    getSchedulesByPrescription(prescriptionNumber) {
        return this.mipresService.getSchedulesByPrescription(prescriptionNumber);
    }
    cancelSchedule(id) {
        return this.mipresService.cancelSchedule(id);
    }
    getDeliveriesByPrescription(prescriptionNumber) {
        return this.mipresService.getDeliveriesByPrescription(prescriptionNumber);
    }
    cancelDelivery(id) {
        return this.mipresService.cancelDelivery(id);
    }
    createDelivery(body) {
        return this.mipresService.createDelivery(body);
    }
    createDeliveryReport(body) {
        return this.mipresService.createDeliveryReport(body);
    }
    getDeliveryReportsByPrescription(prescriptionNumber) {
        return this.mipresService.getDeliveryReportsByPrescription(prescriptionNumber);
    }
    cancelDeliveryReport(id) {
        return this.mipresService.cancelDeliveryReport(id);
    }
    createFacturacion(body) {
        return this.mipresService.createFacturacion(body);
    }
    getFacturacionesByPrescription(prescriptionNumber) {
        return this.mipresService.getFacturacionesByPrescription(prescriptionNumber);
    }
    cancelFacturacion(id) {
        return this.mipresService.cancelFacturacion(id);
    }
};
exports.MipresController = MipresController;
__decorate([
    (0, common_1.Get)('routing/prescription/:prescriptionNumber'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getRoutingsByPrescription", null);
__decorate([
    (0, common_1.Get)('prescription/:prescriptionNumber/workspace'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getWorkspace", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedule/prescription/:prescriptionNumber'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getSchedulesByPrescription", null);
__decorate([
    (0, common_1.Put)('schedule/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "cancelSchedule", null);
__decorate([
    (0, common_1.Get)('delivery/prescription/:prescriptionNumber'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getDeliveriesByPrescription", null);
__decorate([
    (0, common_1.Put)('delivery/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "cancelDelivery", null);
__decorate([
    (0, common_1.Post)('delivery'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "createDelivery", null);
__decorate([
    (0, common_1.Post)('delivery-report'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_report_dto_1.CreateDeliveryReportDto]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "createDeliveryReport", null);
__decorate([
    (0, common_1.Get)('delivery-report/prescription/:prescriptionNumber'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getDeliveryReportsByPrescription", null);
__decorate([
    (0, common_1.Put)('delivery-report/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "cancelDeliveryReport", null);
__decorate([
    (0, common_1.Put)('facturacion'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facturacion_dto_1.CreateFacturacionDto]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "createFacturacion", null);
__decorate([
    (0, common_1.Get)('facturacion/prescription/:prescriptionNumber'),
    __param(0, (0, common_1.Param)('prescriptionNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "getFacturacionesByPrescription", null);
__decorate([
    (0, common_1.Put)('facturacion/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MipresController.prototype, "cancelFacturacion", null);
exports.MipresController = MipresController = __decorate([
    (0, common_1.Controller)('mipres'),
    __metadata("design:paramtypes", [mipres_service_1.MipresService])
], MipresController);
//# sourceMappingURL=mipres.controller.js.map