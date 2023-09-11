import { ApiPropertyOptions } from '@nestjs/swagger'

export const PAYLOAD_KEY = 'publisher-payload'

export function Payload (options: ApiPropertyOptions): ParameterDecorator {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(PAYLOAD_KEY, [parameterIndex, options], target, propertyKey)
  }
}
