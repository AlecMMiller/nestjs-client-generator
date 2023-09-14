import { RequestMethod } from '@nestjs/common'
import { ApiPropertyOptions } from '@nestjs/swagger'

export interface ProjectDefinition {
  routes: RouteSignature[]
  publishers: PublisherSignature[]
  definitions: Definitions
}

export interface PayloadTypeInfo {
  type: string
  options: ApiPropertyOptions
}

export interface PublisherSignature {
  topic: string
  payloadTypeInfo: PayloadTypeInfo
}

export interface RouteSignature {
  url: string
  method: RequestMethod
  possibleResponses: ResponseSignature[]
}

export interface ResponseSignature {
  code: string
  description: string | undefined
  type: string | undefined
  isArray: boolean
}

export interface Definitions {
  objects: Map<String, ObjectInfo>
  enums: Map<String, EnumInfo>
}

export type ObjectInfo = PropertyInfo[]

export interface EnumInfo {
  name: string
  values: EnumPair[]
}

export interface EnumPair {
  name: string
  value: string | number
}

export interface PropertyInfo extends ApiPropertyOptions {
  name: string
  type: string
}
