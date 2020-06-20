import alias from '@rollup/plugin-alias'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs-extra'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { rollup } from 'rollup'
import { loadConfig } from '../config'
import { normalizeCommand } from '../command'
import { compile, readTemplate } from '../template'

export async function build() {
  const {
    root = process.cwd(),
    buildDir = '.wumpy',
    outDir = 'out',
    botToken,
    commands = {}
  } = await loadConfig()

  // Resolve any dependencies of the template
  require('discord.js')

  const { dir = 'commands', prefix = '!' } = commands
  const commandsDir = path.join(root, dir)
  let commandNames: string[] = []

  if (fs.existsSync(commandsDir)) {
    commandNames = await fs.readdir(commandsDir)
  }

  const userCommands = commandNames.map(name => {
    const commandPath = path.join(commandsDir, name)
    return normalizeCommand(commandPath)
  })

  const template = await readTemplate()
  const wumpyApp = compile(template, { botToken, userCommands, prefix })

  await fs.emptyDir(buildDir)

  const appPath = path.join(buildDir, 'main.js')
  await fs.writeFile(appPath, wumpyApp)

  try {
    const bundle = await rollup({
      input: appPath,
      plugins: [
        commonjs(),
        nodeResolve(),
        globals(),
        builtins(),
        alias({
          entries: userCommands.map(c => ({
            find: c.name,
            replacement: c.src
          }))
        })
      ],
      external: ['discord.js']
    })

    await fs.emptyDir(outDir)

    await bundle.write({
      dir: outDir,
      format: 'cjs'
    })
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}
