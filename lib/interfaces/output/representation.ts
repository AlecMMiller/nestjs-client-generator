import { PublisherRepresentation } from './publisher'
import { RestMethod } from './rest'
import { ObjectEntries } from './types'

export interface ApplicationRepresentation {
  restRoutes: RestMethod[]
  publishers: PublisherRepresentation[]
  schema: Map<string, ObjectEntries>
}
