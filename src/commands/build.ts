import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs-extra'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { rollup } from 'rollup'
import template from 'lodash.template'
import { loadConfig } from '../config'

export default async () => {
  const {
    root = process.cwd(),
    buildDir = path.join(root, '.wumpy'),
    outDir = path.join(root, 'out'),
    botToken
  } = await loadConfig()

  // Resolve any dependencies of the template
  require('discord.js')

  const appTemplate = await fs.readFile(
    path.resolve(__dirname, '../../template/main.js'),
    {
      encoding: 'utf8'
    }
  )
  const createApp = template(appTemplate, {
    interpolate: /<%=([\s\S]+?)%>/g
  })
  const hydratedApp = createApp({ botToken })

  await fs.emptyDir(buildDir)

  const appPath = path.join(buildDir, 'main.js')
  await fs.writeFile(appPath, hydratedApp)

  try {
    const bundle = await rollup({
      input: appPath,
      plugins: [commonjs(), nodeResolve(), globals(), builtins()],
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
