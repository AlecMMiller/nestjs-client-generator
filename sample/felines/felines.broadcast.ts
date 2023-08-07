import { Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Feline } from './class'

const EventPatternsMS = {
  createFeline: 'ms/create/feline'
}

@Injectable()
export class FelinesBroadcaster {
  constructor (
    private readonly client: ClientProxy
  ) {}

  broadcastFeline (feline: Feline): void {
    this.client.emit(EventPatternsMS.createFeline, feline)
  }
}
