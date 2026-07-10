import { Module } from '@nestjs/common'
import { EventContractController } from './event-contract.controller'
import { EventContractService } from './event-contract.service'

@Module({
  controllers: [EventContractController],
  providers: [EventContractService],
})
export class EventContractModule {}
