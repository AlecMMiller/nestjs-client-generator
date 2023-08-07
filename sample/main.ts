import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { BOOTSTRAP, DOC_RELATIVE_PATH, HOST, PORT } from './constants'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create<INestApplication>(AppModule)

  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP })

  await app.startAllMicroservices()
  await app.listen(PORT, HOST)

  const baseUrl = `http://${HOST}:${PORT}`
  const docUrl = baseUrl + DOC_RELATIVE_PATH
  Logger.log(`Server started at ${baseUrl}; AsyncApi at ${docUrl};`, BOOTSTRAP)
}

void bootstrap()
