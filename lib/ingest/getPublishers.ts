import { Module } from '@nestjs/core/injector/module'
import { getMethodNames } from '../helpers/getMethods'
import { ProviderWrapper } from '../interfaces/levels'
import { getTopicPattern } from '../decorators'

export interface Publisher {
  providerWrapper: ProviderWrapper
  methodName: string
}

export function getPublishers (modules: Module[]): Publisher[] {
  return modules.flatMap((module) => {
    const providerWrappers = [...module.providers.values()]
    return providerWrappers.flatMap((providerWrapper: ProviderWrapper) => {
      const provider = providerWrapper.instance
      const methodNames = getMethodNames(provider)
      return methodNames.flatMap((methodName) => {
        if (getTopicPattern(provider, methodName) !== undefined) {
          return [{
            providerWrapper,
            methodName
          }]
        }
        return []
      })
    })
  })
}
