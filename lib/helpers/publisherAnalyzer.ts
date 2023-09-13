import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { PAYLOAD_KEY, PUBLISHER_KEY } from '../decorators'
import { getParamTypes } from './getType'
import { PublisherRepresentation } from '../interfaces/output/publisher'

export class PublisherAnalyzer {
  private readonly topicPattern: string
  private readonly payloadInstance: object
  private readonly payloadType: string
  constructor (private readonly provider: InstanceWrapper<object>, private readonly methodName: string) {
    this.topicPattern = Reflect.getMetadata(PUBLISHER_KEY, this.provider.instance, this.methodName)

    if (this.topicPattern === undefined) {
      return
    }

    const [payloadIndex] = Reflect.getMetadata(PAYLOAD_KEY, this.provider.instance, this.methodName)

    const PayloadArgs = getParamTypes(this.provider.instance, this.methodName)

    const payloadInfo = Reflect.getMetadata('publisher-payload', this.provider.instance, this.methodName)[1]

    let payloadFunction: any
    if (payloadInfo.type !== undefined) {
      payloadFunction = payloadInfo.type
    } else {
      payloadFunction = PayloadArgs[payloadIndex] as any
    }

    try {
      this.payloadType = payloadFunction().constructor.name
    } catch (error) {
      const message = error.message as string
      if (message.includes('Class constructor')) {
        // eslint-disable-next-line new-cap
        this.payloadInstance = new payloadFunction()
        this.payloadType = this.payloadInstance.constructor.name
      } else {
        throw error
      }
    }
  }

  getRepresentation (): PublisherRepresentation | undefined {
    if (this.topicPattern === undefined) {
      return undefined
    }
    return {
      topicPattern: this.topicPattern,
      type: {
        name: this.payloadType,
        instance: this.payloadInstance
      }
    }
  }
}
