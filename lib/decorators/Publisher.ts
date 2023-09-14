import { Provider } from '@nestjs/common'
import 'reflect-metadata'

export const PUBLISHER_KEY = 'publisher-method'

export function Publisher (topic: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(PUBLISHER_KEY, topic, target, propertyKey)
  }
}

export function getTopicPattern (provider: Provider, methodName: string): string | undefined {
  return Reflect.getMetadata(PUBLISHER_KEY, provider, methodName)
}
