import fs from 'fs-extra'
import path from 'path'
import { loadConfig } from '../config'
import { loadCommands } from '../command'
import { bundle } from '../bundler'
import { validateTemplate, template, writeTemplates } from '../template'

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
    const commands = await loadCommands(commandsDir)

    await validateTemplate(template.dependencies)
    await fs.emptyDir(buildDir)

    await writeTemplates({
      files: template.files,
      context: {
        botToken,
        commands,
        prefix
      },
      dir: buildDir
    })

    await bundle({
      input: path.join(buildDir, template.entry),
      outDir: path.join(root, outDir),
      aliases: commands.map(c => ({
        find: c.alias,
        replacement: c.src
      }))
    })
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}
