import { INestApplicationContext, RequestMethod } from '@nestjs/common'
import { GeneratorOptions } from 'interfaces/options'
import { NestContainer } from '@nestjs/core'
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util'
import { Module } from '@nestjs/core/injector/module'
import { getMethods } from '../helpers/getMethods'
import { buildPath, getClassPath, getRoutePath } from '../helpers/restPath'

export class Scanner {
  private readonly app: INestApplicationContext
  private readonly options: GeneratorOptions
  private container?: NestContainer
  private globalPrefix?: string
  private modules?: Module[]

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
        const modulePath = getClassPath(controller)
        const methods = getMethods(controller)
        methods.forEach((method) => {
          const routePath = getRoutePath(method)
          const fullPath = buildPath(this.getGlobalPrefix(), modulePath, routePath)
          const requestMethod = Reflect.getOwnMetadata('method', method) as RequestMethod
          console.log(fullPath, requestMethod)
        })
      })
    })
  }

  scan (): void {
    this.getRestRoutes()
  }
}
