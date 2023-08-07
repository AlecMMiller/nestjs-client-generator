import { getParamTypes } from '../helpers/getType'

export function Broadcaster (): any {
  return function (target: any, propertyKey: string): void {
    console.log('broadcaster')
    const params = getParamTypes(target, propertyKey)
    console.log(params[0].name)
  }
}
