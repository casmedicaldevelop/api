import { Module } from '@nestjs/common'
import { TvMedEventoController } from './tvmed-evento.controller'
import { TvMedEventoService } from './tvmed-evento.service'

@Module({
  controllers: [TvMedEventoController],
  providers: [TvMedEventoService],
})
export class TvMedEventoModule {}
