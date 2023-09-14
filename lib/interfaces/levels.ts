import { ClassProvider, Controller } from '@nestjs/common/interfaces'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export type ControllerWrapper = InstanceWrapper<Controller>
export type ProviderWrapper = InstanceWrapper<ClassProvider>
