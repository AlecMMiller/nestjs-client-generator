export interface GeneratorOptions {
  ignoreGlobalPrefix?: boolean
  deepScanRoutes?: boolean
  operationIdFactory?: (controllerKey: string, methodKey: string) => string
}
