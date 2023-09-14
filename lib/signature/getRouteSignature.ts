import { Reflector } from '@nestjs/core'
import { Route } from '../ingest/getRoutes'
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'
import { RequestMethod } from '@nestjs/common'
import { getPossibleRouteResponses } from '../ingest/getRouteResponses'
import { ApiResponseMetadata } from '@nestjs/swagger'
import { ResponseSignature, RouteSignature } from '../interfaces'

export function getMethod (handler: any): RequestMethod {
  const reflector = new Reflector()

  const requestMethodType = reflector.get(METHOD_METADATA, handler)

  return requestMethodType
}

function getUrl (route: Route): string {
  const handler = route.controllerWrapper.instance[route.methodName]

  const reflector = new Reflector()

  const globalUrlPrefix = (route.app as any).config.getGlobalPrefix()

  const controllerMetatype = route.controllerWrapper.metatype
  const controllerUrlPrefix = reflector.get(PATH_METADATA, controllerMetatype)

  const urlEnd = reflector.get(PATH_METADATA, handler)

  const urlComponents = [globalUrlPrefix, controllerUrlPrefix, urlEnd].filter((component) => { return component !== undefined })
  const url = urlComponents.join('/')

  return url
}

function getResponseSignature (responseCode: string, responseInfo: ApiResponseMetadata): ResponseSignature {
  const typeDescriptor = responseInfo.type
  const typeDescriptorType = typeof typeDescriptor

  let type: string | undefined = ''
  if (typeDescriptorType === 'string') {
    type = typeDescriptor as string
  } else if (typeDescriptorType === 'function') {
    type = (typeDescriptor as Function).name
  } else if (typeDescriptorType === undefined) {
    type = undefined
  } else {
    throw new Error(`Unhandled type ${typeDescriptorType} for response ${responseCode}`)
  }

  const isArray = responseInfo.isArray ?? false

  return {
    code: responseCode,
    description: responseInfo.description,
    type,
    isArray
  }
}

function getResponseSignatures (route: Route): ResponseSignature[] {
  const handler = route.controllerWrapper.instance[route.methodName]

  const possibleResponses = getPossibleRouteResponses(handler)

  if (possibleResponses === undefined) {
    return []
  }

  return Object.entries(possibleResponses).map(([responseCode, responseInfo]) => {
    return getResponseSignature(responseCode, responseInfo)
  })
}

export function getRouteSignature (route: Route): RouteSignature {
  const url = getUrl(route)
  const method = getMethod(route.controllerWrapper.instance[route.methodName])
  const possibleResponses = getResponseSignatures(route)

  return {
    url,
    method,
    possibleResponses
  }
}
