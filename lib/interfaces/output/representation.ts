import { PublisherRepresentation } from './publisher'
import { RestMethod } from './rest'
import { JsonSchema } from './types'

export interface ApplicationRepresentation {
  restRoutes: RestMethod[]
  publishers: PublisherRepresentation[]
  schema: Map<string, JsonSchema>
}
