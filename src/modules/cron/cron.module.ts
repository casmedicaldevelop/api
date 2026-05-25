import { Module } from '@nestjs/common'
import { CompanyModule } from '../company/company.module'
import { MipresTokenTask } from './mipres-token.task'

@Module({
  imports: [CompanyModule],
  providers: [MipresTokenTask],
})
export class CronModule {}
