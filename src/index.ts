import { program } from 'commander'

program
  .version(`wumpy ${require('../package').version}`)
  .usage('<command> [options]')

program.command('build').action(async () => {
  const { build } = await import('./commands/build')
  await build()
})

program.parse(process.argv)
