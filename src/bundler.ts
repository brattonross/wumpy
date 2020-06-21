import alias from '@rollup/plugin-alias'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs-extra'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import { Command } from './command'

/**
 * Bundles the wumpy app and writes it to disk.
 */
export async function bundle({
  input,
  commands,
  outDir
}: {
  input: string
  commands: Command[]
  outDir: string
}) {
  const aliases = commands.map(c => ({
    find: c.alias,
    replacement: c.src
  }))

  console.log('aliases', aliases)

  const bundle = await rollup({
    input,
    plugins: [
      commonjs(),
      alias({ entries: aliases }),
      nodeResolve(),
      globals(),
      builtins()
    ],
    external: ['discord.js']
  })

  await fs.emptyDir(outDir)

  await bundle.write({
    dir: outDir,
    format: 'cjs'
  })
}
