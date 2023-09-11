import { ApiPropertyOptions } from '@nestjs/swagger'

export enum PrimitiveType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date'
}

export type ObjectEntries = ObjectEntry[]

export interface ObjectEntry extends ApiPropertyOptions {
  key: string
  valueType: string
}

export interface DataType {
  name: string
  format?: string
  example?: string
  instance?: object
}
