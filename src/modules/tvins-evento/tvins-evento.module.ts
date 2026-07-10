import { Module } from '@nestjs/common'
import { TvInsEventoController } from './tvins-evento.controller'
import { TvInsEventoService } from './tvins-evento.service'

@Module({
  controllers: [TvInsEventoController],
  providers: [TvInsEventoService],
})
export class TvInsEventoModule {}
