import hash from 'hash-sum'
import path from 'path'

export function normalizeCommand(command: string) {
  return {
    src: command,
    name: `wumpy_command_${path.basename(command).split('.').slice(0, -1).join('.')}_${hash(command)}`
  }
}
