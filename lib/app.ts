import { program } from 'commander'
import { scan } from './scan'

program
  .option('--first')
  .option('-s, --separator <char>')

program.parse()

async function generate (location: string): Promise<void> {
  const representation = await scan(location)
  console.log(representation)
}

const args = program.args
void generate(args[0])
