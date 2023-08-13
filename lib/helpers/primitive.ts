import { JsonField } from 'services/scanner'

export enum PrimitiveType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date'
}

export interface ConfigOptions {
  example?: string
  isArray?: boolean
  enum?: any[]
}

export interface PrimitiveSchema extends ConfigOptions {
  type: PrimitiveType
}

export function analyzePrimitive (name: string, type: { name: string }, config: ConfigOptions): JsonField | undefined {
  let resolvedName = type.name

  if (resolvedName === undefined) {
    resolvedName = type as unknown as string
  }

  resolvedName = resolvedName.toLowerCase()

  if (!Object.values(PrimitiveType).includes(resolvedName as PrimitiveType)) {
    return undefined
  }

  const primitive: PrimitiveSchema = {
    type: resolvedName as PrimitiveType,
    ...config
  }

  return {
    name,
    type: primitive
  }
}
