declare module 'rollup-plugin-node-globals' {
  import { Plugin } from 'rollup'

  export interface Options {
    include?: Array<string | RegExp> | string | RegExp | null
    exclude?: Array<string | RegExp> | string | RegExp | null
    sourceMap?: boolean
    process?: boolean
    global?: boolean
    buffer?: boolean
    dirname?: boolean
    filename?: boolean
    baseDir?: string
  }

  export default function (options?: Options): Plugin
}
