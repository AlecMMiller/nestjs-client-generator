import { ApiResponseMetadata } from '@nestjs/swagger'
import { DECORATORS } from '@nestjs/swagger/dist/constants'

export function getPossibleRouteResponses (handler: any): Map<string, ApiResponseMetadata> | undefined {
  const possibleResponses = Reflect.getMetadata(DECORATORS.API_RESPONSE, handler) as Map<string, any>

  return possibleResponses
}
