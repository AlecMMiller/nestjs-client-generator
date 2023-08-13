import 'reflect-metadata'

export const PUBLISHER_KEY = 'publisher'

export function Publisher (topic: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(PUBLISHER_KEY, topic, target, propertyKey)
  }
}
