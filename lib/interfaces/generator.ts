import { InjectionToken } from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export type OperationIdFactory = (controllerKey: string, methodKey: string) => string
export type Providers = Map<InjectionToken, InstanceWrapper<unknown>>
