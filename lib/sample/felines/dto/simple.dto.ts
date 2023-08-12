import { ApiProperty } from '@nestjs/swagger'

export class SimpleDto {
  @ApiProperty()
    number1: number

  @ApiProperty()
    number2: number
}
