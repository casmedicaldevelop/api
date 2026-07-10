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
exports.EventContractController = void 0;
const common_1 = require("@nestjs/common");
const event_contract_service_1 = require("./event-contract.service");
const create_event_contract_dto_1 = require("./dto/create-event-contract.dto");
const finalize_event_contract_dto_1 = require("./dto/finalize-event-contract.dto");
const set_open_event_contract_dto_1 = require("./dto/set-open-event-contract.dto");
let EventContractController = class EventContractController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findActive() {
        return this.service.findActive();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    setOpen(id, dto) {
        return this.service.setOpen(id, dto.isOpen);
    }
    finalize(id, dto) {
        return this.service.finalize(id, dto);
    }
};
exports.EventContractController = EventContractController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_contract_dto_1.CreateEventContractDto]),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/open'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, set_open_event_contract_dto_1.SetOpenEventContractDto]),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "setOpen", null);
__decorate([
    (0, common_1.Patch)(':id/finalize'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, finalize_event_contract_dto_1.FinalizeEventContractDto]),
    __metadata("design:returntype", void 0)
], EventContractController.prototype, "finalize", null);
exports.EventContractController = EventContractController = __decorate([
    (0, common_1.Controller)('event-contract'),
    __metadata("design:paramtypes", [event_contract_service_1.EventContractService])
], EventContractController);
//# sourceMappingURL=event-contract.controller.js.map