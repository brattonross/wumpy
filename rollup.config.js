import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist'
  },
  plugins: [commonjs(), nodeResolve(), builtins(), typescript(), copy({
    targets: [
      { src: 'src/template/**/*', dest: 'dist/template' }
    ]
  })],
  external: [
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    'commander',
    'discord.js',
    'dotenv',
    'fs-extra',
    'lodash.template',
    'rollup',
    'rollup-plugin-node-builtins',
    'rollup-plugin-node-globals'
  ]
}
