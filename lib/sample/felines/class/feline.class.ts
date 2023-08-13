import { ApiProperty } from '@nestjs/swagger'

enum PawsEnum {
  left = 'left',
  right = 'right',
}

enum GendersEnum {
  male = 'male',
  female = 'female',
}

export abstract class Feline {
  @ApiProperty()
    id: number

  @ApiProperty()
    name: string

  @ApiProperty()
    age: number

  @ApiProperty({ enum: GendersEnum })
    gender: GendersEnum

  @ApiProperty({ enum: PawsEnum })
    dominantPaw: PawsEnum

  @ApiProperty({
    isArray: true,
    type: String
  })
    tags: string[]

  @ApiProperty()
    birthDatetime: Date

  constructor (initializer: Record<string, any>) {
    Object.assign(this, initializer)
  }
}
