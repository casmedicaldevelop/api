import { Module } from '@nestjs/common'
import { FilingMipresCatalogController } from './filing-mipres-catalog.controller'
import { FilingMipresCatalogService } from './filing-mipres-catalog.service'

@Module({
  controllers: [FilingMipresCatalogController],
  providers: [FilingMipresCatalogService],
})
export class FilingMipresCatalogModule {}
