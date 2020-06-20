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
  const bundle = await rollup({
    input,
    plugins: [
      commonjs(),
      nodeResolve(),
      globals(),
      builtins(),
      alias({
        entries: commands.map(c => ({
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
}
