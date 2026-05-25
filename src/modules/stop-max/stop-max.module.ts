import { Module } from '@nestjs/common';
import { StopMaxController } from './stop-max.controller';
import { StopMaxService } from './stop-max.service';

@Module({
  controllers: [StopMaxController],
  providers: [StopMaxService],
})
export class StopMaxModule {}
