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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const employees_service_1 = require("./employees.service");
const create_staff_dto_1 = require("./dto/create-staff.dto");
const update_staff_dto_1 = require("./dto/update-staff.dto");
const assign_staff_modules_dto_1 = require("./dto/assign-staff-modules.dto");
const list_staff_dto_1 = require("./dto/list-staff.dto");
let EmployeesController = class EmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    findAll(dto) {
        return this.employeesService.findAll(dto);
    }
    findOne(id) {
        return this.employeesService.findOne(id);
    }
    create(dto) {
        return this.employeesService.create(dto);
    }
    update(id, dto, req) {
        return this.employeesService.update(id, dto, req.user.sub);
    }
    assignModules(id, dto) {
        return this.employeesService.assignModules(id, dto);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_staff_dto_1.ListStaffDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/modules'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_staff_modules_dto_1.AssignStaffModulesDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "assignModules", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map