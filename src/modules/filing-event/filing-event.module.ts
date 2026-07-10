import { Module } from '@nestjs/common'
import { FilingEventController } from './filing-event.controller'
import { FilingEventService } from './filing-event.service'
import { DriveModule } from '../drive/drive.module'

@Module({
  imports: [DriveModule],
  controllers: [FilingEventController],
  providers: [FilingEventService],
})
export class FilingEventModule {}
