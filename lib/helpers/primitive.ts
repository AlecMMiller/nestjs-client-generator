import { ApiProperties, JsonField, PrimitiveSchema, PrimitiveType } from '../interfaces/output/types'

export function analyzePrimitive (name: string, type: { name: string }, config: ApiProperties): JsonField | undefined {
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
