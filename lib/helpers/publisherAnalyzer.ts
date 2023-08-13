import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { PUBLISHER_KEY } from '../decorators'
import { getParamTypes } from './getType'
import { DataType } from './rest/restMethod'

export interface PublisherRepresentation {
  topicPattern: string
  type: DataType
}

export class PublisherAnalyzer {
  private readonly topicPattern: string
  private readonly payload: string
  private readonly payloadInstance: object
  constructor (private readonly provider: InstanceWrapper<object>, private readonly methodName: string) {
    this.topicPattern = Reflect.getMetadata(PUBLISHER_KEY, this.provider.instance, this.methodName)
    if (this.topicPattern === undefined) {
      return
    }

    const PayloadConstructor = getParamTypes(this.provider.instance, this.methodName)[0] as () => void
    this.payloadInstance = new PayloadConstructor()
    this.payload = PayloadConstructor.name
  }

  getRepresentation (): PublisherRepresentation | undefined {
    if (this.topicPattern === undefined) {
      return undefined
    }
    return {
      topicPattern: this.topicPattern,
      type: {
        name: this.payloadInstance.constructor.name,
        instance: this.payloadInstance
      }
    }
  }
}
