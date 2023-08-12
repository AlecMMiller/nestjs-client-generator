import { MetadataScanner } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { getInstancePrototype } from './getInstancePrototype'

export function getMethodNames (wrapper: InstanceWrapper<object>): string[] {
  const proto = getInstancePrototype(wrapper)
  const scanner = new MetadataScanner()
  const methodNames = scanner.getAllMethodNames(proto)
  return methodNames
}
