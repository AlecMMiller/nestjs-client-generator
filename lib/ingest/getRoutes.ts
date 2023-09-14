import { Module } from '@nestjs/core/injector/module'
import { ControllerWrapper } from '../interfaces/levels'
import { getMethodNames } from '../helpers/getMethods'
import { INestApplicationContext } from '@nestjs/common'
import { getMethod } from '../signature/getRouteSignature'

export interface Route {
  app: INestApplicationContext
  controllerWrapper: ControllerWrapper
  methodName: string
}

export function getRoutes (app: INestApplicationContext, modules: Module[]): Route[] {
  return modules.flatMap((module) => {
    const controllerWrappers = [...module.controllers.values()]
    return controllerWrappers.flatMap((controllerWrapper: ControllerWrapper) => {
      const controller = controllerWrapper.instance
      const methodNames = getMethodNames(controller)
      return methodNames.flatMap((methodName) => {
        const handler = controller[methodName]
        const method = getMethod(handler)
        if (method === undefined) {
          return []
        }

        return [{
          app,
          controllerWrapper,
          methodName
        }]
      })
    })
  })
}
