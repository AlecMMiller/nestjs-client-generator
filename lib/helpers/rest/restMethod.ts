import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { buildPath } from './restPath'
import { RequestMethod } from '@nestjs/common'
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'
import { Reflector } from '@nestjs/core'
import { PayloadEntry, RestMethod, RestResponse } from '../../interfaces/output/rest'
import { DataType } from '../../interfaces/output/types'

export class RestMethodAnalyzer {
  private readonly reflector: Reflector = new Reflector()
  private url: string
  private requestMethodType: RequestMethod
  private restHandler: any
  private controllerInstance: any
  private readonly accessor = new ModelPropertiesAccessor()
  private readonly payload: PayloadEntry[] = []
  private readonly responses: RestResponse[] = []

  constructor (private readonly controllerWrapper: InstanceWrapper<object>, private readonly methodName: string, globalPrefix: string, controllerPrefix: string) {
    this.analyzeRequestMetadata()
    this.analyzePath(globalPrefix, controllerPrefix)
    this.analyzeRequestBody()
    this.analyzeResponsePayload()
  }

  private analyzePath (globalPrefix: string, modulePath: string): void {
    const urlEnd = this.getHandlerMetadata(PATH_METADATA)
    this.url = buildPath(globalPrefix, modulePath, urlEnd)
  }

  private analyzeRequestMetadata (): void {
    this.controllerInstance = this.controllerWrapper.instance
    this.restHandler = this.controllerInstance[this.methodName]
    this.requestMethodType = this.reflector.get(METHOD_METADATA, this.restHandler)
  }

  private analyzeResponsePayload (): void {
    const possibleResponses = Reflect.getMetadata(DECORATORS.API_RESPONSE, this.restHandler) as Map<string, any>
    if (possibleResponses === undefined) {
      return
    }

    Object.entries(possibleResponses).forEach(([responseCode, responseInfo]) => {
      let type: undefined | DataType
      if (typeof responseInfo.type === 'function') {
        // eslint-disable-next-line new-cap
        const instanceOfResponseType = new responseInfo.type()
        type = {
          name: instanceOfResponseType.constructor.name,
          instance: instanceOfResponseType
        }
      }

      const response: RestResponse = {
        status: Number(responseCode),
        isArray: responseInfo.isArray === true,
        description: responseInfo.description,
        type
      }
      this.responses.push(response)
    })
  }

  private analyzeRequestBody (): void {
    const requestBodyTypes = this.getControllerMetadataAboutHandler('design:paramtypes')

    requestBodyTypes.forEach((paramType: any) => {
      const paramProto = paramType.prototype
      const meta = this.accessor.getModelProperties(paramProto)

      meta.forEach((property: string) => {
        this.analyzeRestProperty(paramProto, property)
      })
    })
  }

  getRestMethodRepresentation (): RestMethod {
    return {
      path: this.url,
      requestMethod: this.requestMethodType,
      requestPayload: this.payload,
      responses: this.responses
    }
  }

  private getHandlerMetadata (key: string): string {
    return this.reflector.get(key, this.restHandler)
  }

  private getControllerMetadataAboutHandler (key: string): any {
    return Reflect.getMetadata(key, this.controllerInstance, this.methodName)
  }

  private analyzeRestProperty (parameterFieldPrototype: any, propertyName: string): void {
    const meta = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, parameterFieldPrototype, propertyName)
    const typeName = String(meta.type.name)
    let propertyInstance: undefined | object

    if (!['String', 'Number', 'Boolean'].includes(typeName)) {
      // eslint-disable-next-line new-cap
      propertyInstance = new meta.type()
    }

    this.payload.push({
      name: propertyName,
      type: {
        name: typeName,
        format: meta.format,
        example: meta.example,
        instance: propertyInstance
      }
    })
  }
}
