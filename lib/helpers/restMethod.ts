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
  responses: RestResponse[]
}

export interface RestResponse {
  status: number
  description?: string
  isArray: boolean
  type?: DataType
}

export interface DataType {
  name: string
  format?: string
  example?: string
  instance?: object
}

interface PayloadEntry {
  name: string
  type: DataType
}

export class RestMethodAnalyzer {
  private readonly reflector: Reflector = new Reflector()
  private path: string
  private requestMethod: RequestMethod
  private method: any
  private controllerInstance: any
  private readonly accessor = new ModelPropertiesAccessor()
  private readonly payload: PayloadEntry[] = []
  private readonly responses: RestResponse[] = []

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
    this.controllerInstance = this.controller.instance
    this.method = this.controllerInstance[this.methodName]
    this.requestMethod = this.reflector.get(METHOD_METADATA, this.method)
  }

  private analyzeResponsePayload (): void {
    const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, this.method) as Map<string, any>
    if (responses === undefined) {
      return
    }

    Object.entries(responses).forEach(([code, value]) => {
      let type: undefined | DataType
      if (typeof value.type === 'function') {
        // eslint-disable-next-line new-cap
        const instance = new value.type()
        type = {
          name: instance.constructor.name,
          instance
        }
      }

      const response: RestResponse = {
        status: Number(code),
        isArray: value.isArray === true,
        description: value.description,
        type
      }
      this.responses.push(response)
    })
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
      requestPayload: this.payload,
      responses: this.responses
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
      type: {
        name: typeName,
        format: meta.format,
        example: meta.example,
        instance: propertyInstance
      }
    })
  }
}
