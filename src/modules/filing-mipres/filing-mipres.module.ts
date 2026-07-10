import { Module } from '@nestjs/common'
import { FilingMipresController } from './filing-mipres.controller'
import { FilingMipresService } from './filing-mipres.service'
import { DriveModule } from '../drive/drive.module'

@Module({
  imports: [DriveModule],
  controllers: [FilingMipresController],
  providers: [FilingMipresService],
  exports: [FilingMipresService],
})
export class FilingMipresModule {}
