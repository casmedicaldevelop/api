import { Module } from '@nestjs/common'
import { MipresController } from './mipres.controller'
import { MipresService } from './mipres.service'
import { CompanyModule } from '../company/company.module'
import { UsersModule } from '../users/users.module'
import { FilingMipresModule } from '../filing-mipres/filing-mipres.module'

@Module({
  imports: [CompanyModule, UsersModule, FilingMipresModule],
  controllers: [MipresController],
  providers: [MipresService],
})
export class MipresModule {}
