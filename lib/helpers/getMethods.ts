import { MetadataScanner } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export function getMethodNames (wrapper: InstanceWrapper<object>): string[] {
  const instance = wrapper.instance
  const scanner = new MetadataScanner()
  const methodNames = scanner.getAllMethodNames(instance)
  return methodNames
}
