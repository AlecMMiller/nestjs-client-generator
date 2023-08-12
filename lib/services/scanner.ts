import { INestApplicationContext } from '@nestjs/common'
import { GeneratorOptions } from 'interfaces/options'
import { NestContainer } from '@nestjs/core'
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util'
import { Module } from '@nestjs/core/injector/module'
import { getClassPath } from '../helpers/rest/restPath'
import { getMethodNames } from '../helpers/getMethods'
import { RestMethod, RestMethodAnalyzer } from '../helpers/rest/restMethod'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { PublisherAnalyzer, PublisherRepresentation } from '../helpers/publisherAnalyzer'

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
          const model = analyzer.getRepresentation()
          this.restRoutes.push(model)
        })
      })

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

  getRepresentation (): ApplicationRepresentation {
    return {
      restRoutes: this.restRoutes,
      publishers: this.publishers
    }
  }

  scan (): void {
    this.getRestRoutes()
  }
}
