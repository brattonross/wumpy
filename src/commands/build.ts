import fs from 'fs-extra'
import path from 'path'
import { loadConfig } from '../config'
import { loadCommands } from '../command'
import { bundle } from '../bundler'
import { compile, readTemplate, resolveDependencies } from '../template'

export async function build() {
  const {
    root = process.cwd(),
    buildDir = '.wumpy',
    outDir = 'out',
    botToken,
    commands = {}
  } = await loadConfig()
  const { dir = 'commands', prefix = '!' } = commands

  try {
    const commandsDir = path.join(root, dir)
    const userCommands = await loadCommands(commandsDir)

    await resolveDependencies({
      'discord.js': '^12.2.0'
    })
    const template = await readTemplate()
    const wumpyApp = compile(template, { botToken, userCommands, prefix })

    await fs.emptyDir(buildDir)

    const appPath = path.join(buildDir, 'main.js')
    await fs.writeFile(appPath, wumpyApp)

    await bundle({
      input: appPath,
      commands: userCommands,
      outDir
    })
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}
