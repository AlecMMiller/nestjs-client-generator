import { Broadcaster } from './decorators/Broadcaster'
import { Publisher } from './decorators/Publisher'
import { SomeDecorator } from './decorators/SomeDecorator'

export class SomeMethod {
  @SomeDecorator()
    testVal: string

  @Publisher()
  testMethod (): void {

  }

  @Broadcaster()
  broadcastMethod (payload: string, something: number): void {
    console.log(payload, something)
  }
}

export function generate (): void {
  const thing = new SomeMethod()
  thing.testMethod()
  const keys = Reflect.getMetadataKeys(thing, 'testMethod')
  keys.forEach((key) => {
    const meta = Reflect.getMetadata(key, thing, 'testMethod')
    console.log(key, meta)
  })
}

if (require.main === module) {
  generate()
}
