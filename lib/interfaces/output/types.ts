export enum PrimitiveType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date'
}

export type JsonSchema = JsonField[]

export interface JsonField {
  name: string
  type: PrimitiveSchema | JsonSchema
}

export interface PrimitiveSchema extends ApiProperties {
  type: PrimitiveType
}

export interface ApiProperties {
  example?: string
  isArray?: boolean
  enum?: any[]
}

export interface DataType {
  name: string
  format?: string
  example?: string
  instance?: object
}
