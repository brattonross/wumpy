import alias from '@rollup/plugin-alias'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs-extra'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'

export type Alias = { find: string; replacement: string }

export interface BundlerOptions {
  input: string
  outDir: string
  aliases: Alias[]
}

/**
 * Bundles the wumpy app and writes it to disk.
 */
export async function bundle({ input, outDir, aliases }: BundlerOptions) {
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
