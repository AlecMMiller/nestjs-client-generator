import { ClassProvider, Type } from '@nestjs/common'
import { ExtractPayload } from '../decorators'
import { ApiPropertyOptions } from '@nestjs/swagger'
import { PayloadTypeInfo } from '../interfaces'

export type PayloadDefinition = string | Function | Type<unknown> | [Function] | Record<string, any>

interface RawPayloadDescription {
  definition: PayloadDefinition
  options: ApiPropertyOptions
}

export function getRawPublisherPayload (provider: ClassProvider, methodName: string): RawPayloadDescription {
  const metadata = ExtractPayload(provider, methodName)
  const options = metadata.options

  let payloadDefinition: string | Function | Type<unknown> | [Function] | Record<string, any> = metadata.function
  if (options.type !== undefined) {
    payloadDefinition = options.type
  }

  return {
    definition: payloadDefinition,
    options
  }
}

export function getPayloadTypeInfo (rawPayloadDescription: RawPayloadDescription): PayloadTypeInfo {
  const payloadDefinition = rawPayloadDescription.definition
  const payloadDefinitionType = typeof payloadDefinition
  let payloadType: string = ''

  if (payloadDefinitionType === 'string') {
    payloadType = payloadDefinition as string
  } else if (payloadDefinitionType === 'function') {
    payloadType = (payloadDefinition as Function).name
  }

  return {
    type: payloadType,
    options: rawPayloadDescription.options
  }
}
