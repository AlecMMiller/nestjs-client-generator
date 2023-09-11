import { DataType } from './types'
import { RequestMethod } from '@nestjs/common'

export { RequestMethod }

export interface RestMethod {
  path: string
  requestMethod: RequestMethod
  requestPayload: PayloadEntry[]
  responses: RestResponse[]
}

export interface RestResponse {
  status: number
  description?: string
  isArray: boolean
  type?: DataType
}

export interface PayloadEntry {
  name: string
  type: DataType
}
