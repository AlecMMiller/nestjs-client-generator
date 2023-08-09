import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export function getInstancePrototype (wrapper: InstanceWrapper<object>): object {
  return wrapper.metatype.prototype
}
