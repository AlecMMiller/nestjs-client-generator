#! /usr/bin/env node
import { program } from 'commander'
import { scan } from './scan'

program
  .option('--first')
  .option('-s, --separator <char>')

program.parse()

async function generate (location: string, generatorFile: string): Promise<void> {
  const representation = await scan(location)

  const { generator } = await import(generatorFile)
  generator(representation)
}

const args = program.args
void generate(args[0], args[1])
