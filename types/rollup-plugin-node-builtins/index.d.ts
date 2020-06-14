declare module 'rollup-plugin-node-builtins' {
  import { Plugin } from 'rollup'

  export interface Options {
    crypto?: boolean
    fs?: boolean
  }

  export default function (options?: Options): Plugin
}
