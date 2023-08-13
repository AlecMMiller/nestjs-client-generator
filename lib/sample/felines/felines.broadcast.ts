import { Injectable } from '@nestjs/common'
import { Feline } from './class'
import { Publisher } from '../../decorators'

const EventPatternsMS = {
  createFeline: 'ms/create/feline'
}

@Injectable()
export class FelinesBroadcaster {
  @Publisher('ms/create/feline')
  broadcastFeline (feline: Feline): void {
    console.log(EventPatternsMS.createFeline, feline)
  }
}
