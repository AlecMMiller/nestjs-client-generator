import { ClassProvider } from '@nestjs/common'
import { ApiPropertyOptions } from '@nestjs/swagger'
import { getParamTypes } from '../helpers/getType'

export const PAYLOAD_KEY = 'publisher-payload'

export function Payload (options: ApiPropertyOptions): ParameterDecorator {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(PAYLOAD_KEY, [parameterIndex, options], target, propertyKey)
  }
}

interface PayloadMetadata {
  function: () => any
  options: ApiPropertyOptions
}

export function ExtractPayload (provider: ClassProvider, methodName: string): PayloadMetadata {
  const PayloadArgs = getParamTypes(provider, methodName)
  const payloadMetadata = Reflect.getMetadata(PAYLOAD_KEY, provider, methodName)
  const payloadIndex: number = payloadMetadata[0]
  const payloadInfo: ApiPropertyOptions = payloadMetadata[1]
  const payloadFunction = PayloadArgs[payloadIndex] as any

  return {
    function: payloadFunction,
    options: payloadInfo
  }
}
