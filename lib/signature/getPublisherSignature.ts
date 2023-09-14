
import { Publisher } from '../ingest/getPublishers'
import { getPayloadTypeInfo, getRawPublisherPayload } from '../helpers/payloadAnalyzer'
import { getTopicPattern } from '../decorators'
import { PublisherSignature } from '../interfaces'

export function getPublisherSignature (publisher: Publisher): PublisherSignature {
  const provider = publisher.providerWrapper.instance
  const methodName = publisher.methodName

  const topic = getTopicPattern(provider, methodName)

  if (topic === undefined) {
    throw new Error(`No topic pattern found for ${provider.constructor.name}.${methodName}`)
  }

  const rawInfo = getRawPublisherPayload(provider, methodName)
  const payloadTypeInfo = getPayloadTypeInfo(rawInfo)

  return {
    topic,
    payloadTypeInfo
  }
}
