import { getType } from '../helpers/getType'

export function SomeDecorator (): any {
  return function (target: any, propertyKey: string): void {
    const type = getType(target, propertyKey)
    console.log('some decorator')
    console.log(type.name)
  }
}
