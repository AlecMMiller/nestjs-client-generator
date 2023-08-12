import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { buildPath } from './restPath'
import { RequestMethod } from '@nestjs/common'
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'
import { Reflector } from '@nestjs/core'

export interface RestMethod {
  path: string
  requestMethod: RequestMethod
  requestPayload: PayloadEntry[]
}

interface PayloadEntry {
  name: string
  type: string
  format?: string
  example?: string
  instance?: object
}

export class RestMethodAnalyzer {
  private readonly reflector: Reflector = new Reflector()
  private path: string
  private requestMethod: RequestMethod
  private method: any
  private controllerInstance: any
  private metatype: any
  private readonly accessor = new ModelPropertiesAccessor()
  private readonly payload: PayloadEntry[] = []

  constructor (private readonly controller: InstanceWrapper<object>, private readonly methodName: string, globalPrefix: string, modulePath: string) {
    this.analyzeRequestMetadata()
    this.analyzePath(globalPrefix, modulePath)
    this.analyzeRequestPayload()
    this.analyzeResponsePayload()
  }

  private analyzePath (globalPrefix: string, modulePath: string): void {
    const pathEnd = this.reflector.get(PATH_METADATA, this.method)
    this.path = buildPath(globalPrefix, modulePath, pathEnd)
  }

  private analyzeRequestMetadata (): void {
    this.metatype = this.controller.metatype
    this.controllerInstance = this.controller.instance
    this.method = this.controllerInstance[this.methodName]
    this.requestMethod = this.reflector.get(METHOD_METADATA, this.method)
  }

  private analyzeResponsePayload (): void {
    const returnType = this.getMetadata('design:returntype')

    const responseProto = returnType.prototype
    console.log(responseProto)
    // console.log(typeof responseProto)
    // console.log(Reflect.getOwnMetadataKeys(responseProto))
  }

  private analyzeRequestPayload (): void {
    const paramTypes = this.getMetadata('design:paramtypes')

    paramTypes.forEach((paramType: any) => {
      const paramProto = paramType.prototype
      const meta = this.accessor.getModelProperties(paramProto)

      meta.forEach((property: string) => {
        this.analyzeRestProperty(paramProto, property)
      })
    })
  }

  getRepresentation (): RestMethod {
    return {
      path: this.path,
      requestMethod: this.requestMethod,
      requestPayload: this.payload
    }
  }

  private getMetadata (key: string): any {
    return Reflect.getMetadata(key, this.controllerInstance, this.methodName)
  }

  private analyzeRestProperty (proto: any, property: string): void {
    const meta = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, proto, property)
    const typeName = String(meta.type.name)
    let propertyInstance: undefined | object

    if (!['String', 'Number', 'Boolean'].includes(typeName)) {
      // eslint-disable-next-line new-cap
      propertyInstance = new meta.type()
    }

    this.payload.push({
      name: property,
      type: typeName,
      format: meta.format,
      example: meta.example,
      instance: propertyInstance
    })
  }
}
