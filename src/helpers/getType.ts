interface TypeInfo {
  name: string
}

type ParamTypes = TypeInfo[]

export function getParamTypes (target: Object, propertyKey: string): ParamTypes {
  return Reflect.getMetadata('design:paramtypes', target, propertyKey)
}

export function getType (target: Object, propertyKey: string): TypeInfo {
  return Reflect.getMetadata('design:type', target, propertyKey)
}
