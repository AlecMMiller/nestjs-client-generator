import { MetadataScanner } from '@nestjs/core'

export function getMethodNames (instance: Object): string[] {
  const scanner = new MetadataScanner()
  const methodNames = scanner.getAllMethodNames(instance)
  return methodNames
}
