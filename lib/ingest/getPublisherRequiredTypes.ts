import { Constructor, getConstructor } from '../helpers/getConstructor'
import { getRawPublisherPayload } from '../helpers/payloadAnalyzer'
import { Publisher } from './getPublishers'

export function getPublisherRequiredTypeConstructor (publisher: Publisher): Constructor | undefined {
  const payloadDefinition = getRawPublisherPayload(publisher.providerWrapper.instance, publisher.methodName).definition
  return getConstructor(payloadDefinition)
}
