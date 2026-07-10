import { Module } from '@nestjs/common'
import { TvDataController } from './tv-data.controller'
import { TvDataService } from './tv-data.service'

@Module({
  controllers: [TvDataController],
  providers: [TvDataService],
})
export class TvDataModule {}
