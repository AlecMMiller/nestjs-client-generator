import { NestFactory } from '@nestjs/core'
import { Scanner } from './services/scanner'

export async function bootstrap (path: string): Promise<void> {
  console.log(path)
  // const app = await NestFactory.create(AppModule);
  const { AppModule } = await import(path)
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
  const scanner = new Scanner(app, {})
  scanner.scan()
  await app.close()
}
