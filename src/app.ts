import { program } from 'commander'

program
  .option('--first')
  .option('-s, --separator <char>')

program.parse()

const options = program.opts()
console.log(options.first)
