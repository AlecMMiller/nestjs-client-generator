import { program } from 'commander'
import { bootstrap } from './fakeBootstrap'

program
  .option('--first')
  .option('-s, --separator <char>')

program.parse()

const args = program.args
void bootstrap(args[0])
