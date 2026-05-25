import { Module } from '@nestjs/common'
import { TvMedController } from './tv-med.controller'
import { TvMedService } from './tv-med.service'

@Module({
  controllers: [TvMedController],
  providers: [TvMedService],
})
export class TvMedModule {}
