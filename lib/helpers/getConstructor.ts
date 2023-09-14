import { PayloadDefinition } from './payloadAnalyzer'

export type Constructor = () => void

export function getConstructor (definition: PayloadDefinition): Constructor | undefined {
  if (typeof definition === 'string') {
    return undefined
  }

  if (typeof definition !== 'function') {
    throw new Error(`Unknown payload type: ${typeof definition}`)
  }

  const instanceName = definition.name
  if (['String', 'Number', 'Boolean', 'Date'].includes(instanceName)) {
    return undefined
  }

  return definition as Constructor
}
