import fs from 'fs-extra'
import path from 'path'
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
