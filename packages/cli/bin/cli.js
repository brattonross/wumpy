#!/usr/bin/env node
const { program } = require('commander')

program
  .version(`@concord/cli ${require('../package').version}`)
  .usage('<command> [options]')

program.command('build').action(() => {
  require('../lib/build')()
})

program.parse(process.argv)
