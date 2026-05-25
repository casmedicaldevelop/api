"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const employees_module_1 = require("./modules/employees/employees.module");
const system_modules_module_1 = require("./modules/system-modules/system-modules.module");
const products_module_1 = require("./modules/products/products.module");
const providers_module_1 = require("./modules/providers/providers.module");
const users_module_1 = require("./modules/users/users.module");
const company_module_1 = require("./modules/company/company.module");
const cron_module_1 = require("./modules/cron/cron.module");
const stop_max_module_1 = require("./modules/stop-max/stop-max.module");
const mipres_module_1 = require("./modules/mipres/mipres.module");
const tv_med_module_1 = require("./modules/tv-med/tv-med.module");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
const must_change_password_guard_1 = require("./modules/auth/guards/must-change-password.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            employees_module_1.EmployeesModule,
            system_modules_module_1.SystemModulesModule,
            products_module_1.ProductsModule,
            providers_module_1.ProvidersModule,
            users_module_1.UsersModule,
            company_module_1.CompanyModule,
            cron_module_1.CronModule,
            stop_max_module_1.StopMaxModule,
            mipres_module_1.MipresModule,
            tv_med_module_1.TvMedModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: must_change_password_guard_1.MustChangePasswordGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map