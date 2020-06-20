import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'
import _template from 'lodash.template'

/**
 * Compile a wumpy app template.
 */
export function compile(template: string, context?: Record<string, any>) {
  const compile = _template(template, {
    interpolate: /<%=([\s\S]+?)%>/g
  })
  return compile(context)
}

export async function readTemplate() {
  return await fs.readFile(path.resolve(__dirname, './template/main.js'), {
    encoding: 'utf8'
  })
}

/**
 * Resolves each of the template's dependencies and ensures that the required
 * versions are installed.
 */
export async function resolveDependencies(
  dependencies: Record<string, string>
) {
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
