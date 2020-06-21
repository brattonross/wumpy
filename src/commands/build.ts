import fs from 'fs-extra'
import path from 'path'
import { loadConfig } from '../config'
import { loadCommands } from '../command'
import { bundle } from '../bundler'
import { compile, readTemplate, validateTemplate, template } from '../template'

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

    await Promise.all(
      template.files.map(async filename => {
        const templateContent = await readTemplate(filename)
        const compiledTemplate = compile(templateContent, {
          botToken,
          commands,
          prefix
        })

        const buildPath = path.join(buildDir, filename)
        await fs.writeFile(buildPath, compiledTemplate)
      })
    )

    await bundle({
      input: path.join(buildDir, template.entry),
      commands,
      outDir: path.join(root, outDir)
    })
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}
