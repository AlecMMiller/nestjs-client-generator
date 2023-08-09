import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util'

export function getClassPath (target: InstanceWrapper<object>): string {
  const path = Reflect.getMetadata('path', target.metatype)
  return stripLastSlash(path)
}

export function getRoutePath (target: Function): string {
  const path = Reflect.getMetadata('path', target)
  return stripLastSlash(path)
}

export function buildPath (globalPrefix: string, classPath: string, routePath: string): string {
  const paths = [globalPrefix, classPath, routePath].filter(path => path.trim() !== '')
  return paths.join('/')
}
