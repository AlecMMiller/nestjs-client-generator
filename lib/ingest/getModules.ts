import { INestApplicationContext } from '@nestjs/common'
import { NestContainer } from '@nestjs/core'
import { Module } from '@nestjs/core/injector/module'

export function getModules (app: INestApplicationContext): Module[] {
  const container = (app as any).container as NestContainer
  const modulesContainer = container.getModules()
  const modules = [...modulesContainer.values()]
  return modules
}
