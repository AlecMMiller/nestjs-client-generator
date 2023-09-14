import { ApiResponseMetadata } from '@nestjs/swagger'
import { Constructor, getConstructor } from '../helpers/getConstructor'
import { getPossibleRouteResponses } from './getRouteResponses'
import { Route } from './getRoutes'

function getResponseRequiredTypesConstructors (response: ApiResponseMetadata): Constructor[] {
  if (response.type === undefined) {
    return []
  }

  const instance = getConstructor(response.type)
  if (instance === undefined) {
    return []
  } else {
    return [instance]
  }
}

export function getRouteRequiredTypesConstructors (route: Route): Constructor[] {
  const handler = route.controllerWrapper.instance[route.methodName]
  const possibleResponses = getPossibleRouteResponses(handler)
  if (possibleResponses === undefined) {
    return []
  }

  const responseValues = Object.values(possibleResponses)

  const responseRequiredTypesConstructors = responseValues.flatMap((response) => {
    return getResponseRequiredTypesConstructors(response)
  })

  return responseRequiredTypesConstructors
}
