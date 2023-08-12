import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { buildPath } from './restPath'
import { RequestMethod } from '@nestjs/common'
import { getInstancePrototype } from './getInstancePrototype'
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'

interface RestMethod {
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
  private readonly path: string
  private readonly method: RequestMethod
  private readonly proto: any
  private readonly metatype: Object
  private readonly accessor = new ModelPropertiesAccessor()
  private readonly methodName: string
  private readonly payload: PayloadEntry[] = []

  constructor (controller: InstanceWrapper<object>, methodName: string, globalPrefix: string, modulePath: string) {
    const controllerProto = getInstancePrototype(controller)
    const method = controllerProto[methodName]
    this.method = Reflect.getMetadata(METHOD_METADATA, method)
    this.metatype = controller.metatype
    this.methodName = methodName
    const pathEnd = Reflect.getMetadata(PATH_METADATA, this.metatype)
    this.path = buildPath(globalPrefix, modulePath, pathEnd)
    this.proto = getInstancePrototype(controller) as any

    this.analyzeRequestPayload()
    const returnType = this.getMetadata('design:returntype')
    console.log(returnType)
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
      requestMethod: this.method,
      requestPayload: this.payload
    }
  }

  private getMetadata (key: string): any {
    return Reflect.getMetadata(key, this.proto, this.methodName)
  }

  private getOwnMetadata (key: string): any {
    return Reflect.getOwnMetadata(key, this.proto)
  }

  private analyzeRestProperty (proto: any, property: string): void {
    const meta = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, proto, property)
    const Type = String(meta.type.name)
    let propertyInstance: undefined | object

    if (!['String', 'Number', 'Boolean'].includes(Type)) {
      propertyInstance = new meta.Type()
    }

    this.payload.push({
      name: property,
      type: Type,
      format: meta.format,
      example: meta.example,
      instance: propertyInstance
    })
  }
}
