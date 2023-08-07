import 'reflect-metadata'

export function Publisher (): MethodDecorator {
  console.log('Publisher')
  return (target: any, propertyKey: string | symbol) => {
    console.log('propertyKey', propertyKey)
    console.log('target', target)
    Reflect.defineMetadata('publisher', true, target, propertyKey)
  }
}
