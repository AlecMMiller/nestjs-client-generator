import { ApplicationRepresentation } from 'interfaces'
import { Scanner } from './services/scanner'
import { Test } from '@nestjs/testing'

export async function scan (path: string): Promise<ApplicationRepresentation | undefined> {
  const { AppModule } = await import(path)
  const fakeApp = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()
  const app = fakeApp.createNestApplication()
  const scanner = new Scanner(app, {})
  scanner.scan()
  await app.close()
  return scanner.getRepresentation()
}
