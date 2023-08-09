import { MetadataScanner } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { getInstancePrototype } from './getInstancePrototype'

export function getMethods (wrapper: InstanceWrapper<object>): Function[] {
  const proto = getInstancePrototype(wrapper)
  const scanner = new MetadataScanner()
  const methodNames = scanner.getAllMethodNames(proto)
  const methods = methodNames.map(methodName => proto[methodName])
  console.log(Reflect.getMetadataKeys(proto, methodNames[0]))
  console.log(Reflect.getMetadata('design:paramtypes', proto, methodNames[0]))
  return methods
}
