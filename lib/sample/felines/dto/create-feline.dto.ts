import { ApiProperty } from '@nestjs/swagger'
import { Cat, Lion, Message, Tiger } from '../class'

type AllFelines = Cat | Lion | Tiger

export class CreateFelineDto extends Message<AllFelines> {
  @ApiProperty()
    payload: Cat
}
