import { ApiPropertyOptions } from '@nestjs/swagger'
import { ObjectEntry, PrimitiveType } from '../interfaces/output/types'

export function analyzePrimitive (name: string, type: { name: string }, config: ApiPropertyOptions): ObjectEntry | undefined {
  let resolvedName = type.name

  if (resolvedName === undefined) {
    resolvedName = type as unknown as string
  }

  resolvedName = resolvedName.toLowerCase()

  if (!Object.values(PrimitiveType).includes(resolvedName as PrimitiveType)) {
    return undefined
  }

  return {
    key: name,
    valueType: resolvedName,
    ...config
  }
}
