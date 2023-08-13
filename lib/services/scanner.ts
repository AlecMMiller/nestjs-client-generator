import { INestApplicationContext, Type } from '@nestjs/common'
import { GeneratorOptions } from 'interfaces/options'
import { NestContainer } from '@nestjs/core'
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util'
import { Module } from '@nestjs/core/injector/module'
import { getClassPath } from '../helpers/rest/restPath'
import { getMethodNames } from '../helpers/getMethods'
import { DataType, RestMethod, RestMethodAnalyzer } from '../helpers/rest/restMethod'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { PublisherAnalyzer, PublisherRepresentation } from '../helpers/publisherAnalyzer'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor'
import { PrimitiveSchema, analyzePrimitive } from '../helpers/primitive'

type ClassSchema = Array<ClassSchema | PrimitiveSchema>
export interface ApplicationRepresentation {
  restRoutes: RestMethod[]
  publishers: PublisherRepresentation[]
}

export class Scanner {
  private readonly app: INestApplicationContext
  private readonly options: GeneratorOptions
  private container?: NestContainer
  private globalPrefix?: string
  private modules?: Module[]
  private readonly restRoutes: RestMethod[] = []
  private readonly publishers: PublisherRepresentation[] = []
  private readonly schemaMap: Map<string, ClassSchema> = new Map()

  constructor (app: INestApplicationContext, options: GeneratorOptions) {
    this.app = app
    this.options = options
  }

  private getContainer (): NestContainer {
    if (this.container === undefined) {
      this.container = (this.app as any).container
    }
    return this.container as NestContainer
  }

  private getGlobalPrefix (): string {
    if (this.globalPrefix === undefined) {
      if (this.options.ignoreGlobalPrefix === true) {
        return ''
      }
      const internalConfigRef = (this.app as any).config
      const prefix = internalConfigRef?.getGlobalPrefix()
      this.globalPrefix = stripLastSlash(prefix)
    }
    return this.globalPrefix
  }

  private getModules (): Module[] {
    if (this.modules === undefined) {
      const container = this.getContainer()
      const modules = container.getModules()
      this.modules = [...modules.values()]
    }
    return this.modules
  }

  private getRestRoutes (): void {
    const modules = this.getModules()
    modules.forEach((module) => {
      module.controllers.forEach((controller) => {
        const controllerPath = getClassPath(controller)
        const methodNames = getMethodNames(controller)
        methodNames.forEach((method) => {
          const analyzer = new RestMethodAnalyzer(controller, method, this.getGlobalPrefix(), controllerPath)
          const model = analyzer.getRestMethodRepresentation()
          this.restRoutes.push(model)
        })
      })
    })
  }

  private getBroadcasters (): void {
    const modules = this.getModules()
    modules.forEach((module) => {
      module.providers.forEach((provider) => {
        const methods = getMethodNames(provider as InstanceWrapper<object>)
        methods.forEach((method) => {
          const analyzer = new PublisherAnalyzer(provider as InstanceWrapper<object>, method)
          const model = analyzer.getRepresentation()
          if (model !== undefined) {
            this.publishers.push(model)
          }
        })
      })
    })
  }

  private analyzeType (rootType: DataType): void {
    const instance = rootType.instance

    if (instance === undefined) {
      return
    }

    const name = rootType.name

    if (this.schemaMap.has(name)) {
      return
    }

    const schema: ClassSchema = []

    const accessor = new ModelPropertiesAccessor()
    const properties = accessor.getModelProperties(instance as Type<unknown>)

    properties.forEach((propertyName) => {
      const { type, ...config } = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, instance, propertyName)
      const primitive = analyzePrimitive(propertyName, type, config)
      if (primitive !== undefined) {
        schema.push(primitive)
        return
      }

      const typeName = type.name

      if (typeName === 'Array') {
        console.log(type())
      }
    })

    this.schemaMap.set(name, schema)

    // const apiModelProperties = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, instance)

    // apiModelProperties.forEach((property: any) => {
    //   const meta = property.type
    //   //console.log(property)
    // })
  }

  private populateSchema (): void {
    this.restRoutes.forEach((route) => {
      route.requestPayload?.forEach((field) => {
        this.analyzeType(field.type)
      })
    })

    this.publishers.forEach((publisher) => {
      this.analyzeType(publisher.type)
    })
  }

  getRepresentation (): ApplicationRepresentation {
    return {
      restRoutes: this.restRoutes,
      publishers: this.publishers
    }
  }

  scan (): void {
    this.getRestRoutes()
    this.getBroadcasters()
    this.populateSchema()
    console.log(this.schemaMap)
  }
}
