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
const tv_data_module_1 = require("./modules/tv-data/tv-data.module");
const tvmed_evento_module_1 = require("./modules/tvmed-evento/tvmed-evento.module");
const tvins_evento_module_1 = require("./modules/tvins-evento/tvins-evento.module");
const catalogs_module_1 = require("./modules/catalogs/catalogs.module");
const event_contract_module_1 = require("./modules/event-contract/event-contract.module");
const filing_event_module_1 = require("./modules/filing-event/filing-event.module");
const filing_mipres_module_1 = require("./modules/filing-mipres/filing-mipres.module");
const filing_mipres_catalog_module_1 = require("./modules/filing-mipres-catalog/filing-mipres-catalog.module");
const doctors_module_1 = require("./modules/doctors/doctors.module");
const diagnoses_module_1 = require("./modules/diagnoses/diagnoses.module");
const drive_module_1 = require("./modules/drive/drive.module");
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
            tv_data_module_1.TvDataModule,
            tvmed_evento_module_1.TvMedEventoModule,
            tvins_evento_module_1.TvInsEventoModule,
            catalogs_module_1.CatalogsModule,
            event_contract_module_1.EventContractModule,
            filing_event_module_1.FilingEventModule,
            filing_mipres_module_1.FilingMipresModule,
            filing_mipres_catalog_module_1.FilingMipresCatalogModule,
            doctors_module_1.DoctorsModule,
            diagnoses_module_1.DiagnosesModule,
            drive_module_1.DriveModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: must_change_password_guard_1.MustChangePasswordGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map