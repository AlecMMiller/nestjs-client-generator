import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateFelineDto } from './dto'
import { FelinesService } from './felines.service'
import { FelineRto } from './rto'

@Controller()
export class FelinesController {
  constructor (
    private readonly felinesService: FelinesService
  ) {}

  @Post()
  async createCat (@Body() createFelineDto: CreateFelineDto): Promise<void> {
    await this.felinesService.create(createFelineDto)
  }

  @Get()
  async getCat (): Promise<FelineRto> {
    return await this.getCat()
  }
}
