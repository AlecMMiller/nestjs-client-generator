import { Test } from '@nestjs/testing'
import { getModules } from './ingest/getModules'
import { getPublishers } from './ingest/getPublishers'
import { getPublisherSignature } from './signature/getPublisherSignature'
import { getRoutes } from './ingest/getRoutes'
import { getRouteSignature } from './signature/getRouteSignature'
import { getPublisherRequiredTypeConstructor } from './ingest/getPublisherRequiredTypes'
import { getRouteRequiredTypesConstructors } from './ingest/getRouteRequiredTypes'
import { Constructor } from './helpers/getConstructor'
import { TypeExtractor } from './helpers/typeExtractor'
import { ProjectDefinition } from './interfaces'

export async function scan (path: string): Promise<ProjectDefinition> {
  const { AppModule } = await import(path)
  const fakeApp = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()
  const app = fakeApp.createNestApplication()
  const modules = getModules(app)

  const publishers = getPublishers(modules)
  const publisherSignatures = publishers.map((publisher) => {
    return getPublisherSignature(publisher)
  })

  const routes = getRoutes(app, modules)
  const routeSignatures = routes.map((route) => {
    return getRouteSignature(route)
  })

  const publisherRequiredTypeConstructors = publishers.map((publisher) => {
    return getPublisherRequiredTypeConstructor(publisher)
  })

  const routeRequiredTypesConstructors = routes.flatMap((route) => {
    return getRouteRequiredTypesConstructors(route)
  })

  const allRootRequiredTypeConstructors = publisherRequiredTypeConstructors
    .concat(routeRequiredTypesConstructors)
    .filter((instance) => { return instance !== undefined }) as Constructor[]

  const extractor = new TypeExtractor(allRootRequiredTypeConstructors)
  const definitions = extractor.get()

  const projectDefinition = {
    routes: routeSignatures,
    publishers: publisherSignatures,
    definitions
  }

  await app.close()

  return projectDefinition
}
