import { PARAMTYPES_METADATA } from '@nestjs/common/constants'

interface TypeInfo {
  name: string
}

type ParamTypes = TypeInfo[]

export function getParamTypes (target: Object, propertyKey: string): ParamTypes {
  return Reflect.getMetadata(PARAMTYPES_METADATA, target, propertyKey)
}

export function getType (target: Object, propertyKey: string): TypeInfo {
  return Reflect.getMetadata('design:type', target, propertyKey)
}
