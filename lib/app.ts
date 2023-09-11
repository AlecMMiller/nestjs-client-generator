#! /usr/bin/env node
import { program } from 'commander'
import { scan } from './scan'
import path from 'path'

program
  .option('--first')
  .option('-s, --separator <char>')

program.parse()

async function generate (location: string, generatorFile: string): Promise<void> {
  const baseDirectory = process.env.INIT_CWD
  if (baseDirectory === undefined) {
    throw Error('Could not find base directory')
  }
  const scannedLocation = path.join(baseDirectory, location)
  const representation = await scan(scannedLocation)

  const generatorLocation = path.join(baseDirectory, 'node_modules', generatorFile)
  const { generator } = await import(generatorLocation)
  generator(representation)
}

const args = program.args
void generate(args[0], args[1])
