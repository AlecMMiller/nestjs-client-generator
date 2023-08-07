import { Injectable } from '@nestjs/common'
import { Feline } from './class'
import { CreateFelineDto } from './dto'
import { FelinesBroadcaster } from './felines.broadcast'

@Injectable()
export class FelinesService {
  constructor (
    private readonly broadcaster: FelinesBroadcaster
  ) {}

  private readonly felines: Feline[] = []

  async get (id: number): Promise<Feline | undefined> {
    return this.felines[id]
  }

  async delete (id: number): Promise<boolean> {
    const felineToDelete = await this.get(id)
    if (felineToDelete === undefined) return false
    this.felines.splice(id, 1)
    return true
  }

  async create (createFelineDto: CreateFelineDto): Promise<Feline> {
    const feline = createFelineDto.payload
    this.felines.push(feline)
    await this.broadcaster.broadcastFeline(feline)
    return feline
  }
}
