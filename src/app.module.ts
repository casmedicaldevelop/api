import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { SystemModulesModule } from './modules/system-modules/system-modules.module';
import { ProductsModule } from './modules/products/products.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { CompanyModule } from './modules/company/company.module';
import { CronModule } from './modules/cron/cron.module';
import { StopMaxModule } from './modules/stop-max/stop-max.module';
import { MipresModule } from './modules/mipres/mipres.module';
import { TvMedModule } from './modules/tv-med/tv-med.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { MustChangePasswordGuard } from './modules/auth/guards/must-change-password.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    EmployeesModule,
    SystemModulesModule,
    ProductsModule,
    ProvidersModule,
    UsersModule,
    CompanyModule,
    CronModule,
    StopMaxModule,
    MipresModule,
    TvMedModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: MustChangePasswordGuard },
  ],
})
export class AppModule {}
