import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateFelineDto } from './dto'
import { FelinesService } from './felines.service'
import { FelineRto } from './rto'
import { SimpleDto } from './dto/simple.dto'

@Controller('test')
export class FelinesController {
  constructor (
    private readonly felinesService: FelinesService
  ) {}

  @Post()
  async createCat (@Body() createFelineDto: CreateFelineDto): Promise<void> {
    await this.felinesService.create(createFelineDto)
  }

  @Get('test2')
  async getCat (): Promise<FelineRto> {
    return await this.getCat()
  }

  @Post('simple')
  async doSimple (@Body() simpleDto: SimpleDto): Promise<number> {
    return simpleDto.number1 + simpleDto.number2
  }
}
