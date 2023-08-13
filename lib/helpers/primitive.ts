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
  name: string
}

export function analyzePrimitive (name: string, type: { name: string }, config: ConfigOptions): PrimitiveSchema | undefined {
  let resolvedName = type.name

  if (resolvedName === undefined) {
    resolvedName = type as unknown as string
  }

  resolvedName = resolvedName.toLowerCase()

  if (!Object.values(PrimitiveType).includes(resolvedName as PrimitiveType)) {
    return undefined
  }

  return {
    name,
    type: resolvedName as PrimitiveType,
    ...config
  }
}
