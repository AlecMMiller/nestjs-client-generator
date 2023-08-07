import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { FELINES_MS } from './felines.constants'
import { FelinesController } from './felines.controller'
import { FelinesService } from './felines.service'
import { FelinesBroadcaster } from './felines.broadcast'

@Module({
  imports: [
    ClientsModule.register([{ name: FELINES_MS, transport: Transport.TCP }])
  ],
  providers: [FelinesService, FelinesBroadcaster],
  controllers: [FelinesController]
})
export class FelinesModule {}
