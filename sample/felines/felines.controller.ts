import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { CreateFelineDto } from './dto'
import { FELINES_MS } from '#sample/felines/felines.constants'
import { FelinesService } from '#sample/felines/felines.service'
import { FelineRto } from '#sample/felines/rto'

@Controller()
export class FelinesController {
  constructor (
    @Inject(FELINES_MS)
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
