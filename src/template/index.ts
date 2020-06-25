import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'
import _template from 'lodash.template'

export const template = {
  dependencies: {
    'discord.js': '^12.2.0'
  },
  entry: 'main.js',
  files: ['main.js', 'commands.js']
}

export interface BuildArgs {
  files: string[]
  context: Record<string, any>
  dir: string
}

/**
 * Compiles and writes each of the provided template files to disk.
 */
export async function writeTemplates({ files, context, dir }: BuildArgs) {
  return await Promise.all(
    files.map(async filename => {
      const templateContent = await readTemplate(filename)
      const compiledTemplate = compile(templateContent, context)

      const buildPath = path.join(dir, filename)
      await fs.writeFile(buildPath, compiledTemplate)
    })
  )
}

/**
 * Resolves each of the template's dependencies and ensures that the required
 * versions are installed.
 */
export async function validateTemplate(dependencies: Record<string, string>) {
  await Promise.all(
    Object.entries(dependencies).map(async ([name, version]) => {
      const pkg = await import(path.join(name, 'package.json'))
      if (pkg) {
        if (!semver.satisfies(pkg.version, version)) {
          console.warn(
            `${name}@${version} is recommended but ${name}@${pkg.version} is installed!`
          )
        }
      } else {
        console.warn(`${name}@${version} is required but not installed!`)
      }
    })
  )
}

/**
 * Compile a wumpy app template.
 */
function compile(template: string, context?: Record<string, any>) {
  const compile = _template(template, {
    interpolate: /<%=([\s\S]+?)%>/g
  })
  return compile(context)
}

async function readTemplate(filename: string) {
  return await fs.readFile(path.resolve(__dirname, './template', filename), {
    encoding: 'utf8'
  })
}
