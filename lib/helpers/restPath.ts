import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util'

function getPath (target: Object): string {
  const path = Reflect.getMetadata('path', target)
  return stripLastSlash(path)
}

export function getClassPath (target: InstanceWrapper<object>): string {
  return getPath(target.metatype)
}

export function getRoutePath (target: Function): string {
  return getPath(target)
}

export function buildPath (globalPrefix: string, classPath: string, routePath: string): string {
  const paths = [globalPrefix, classPath, routePath].filter(path => path.trim() !== '' && path.trim() !== '/')
  return paths.join('/')
}
