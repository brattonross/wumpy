import fs from 'fs-extra'
import hash from 'hash-sum'
import path from 'path'

export interface Command {
  src: string
  name: string
}

/**
 * Reads commands from the given directory.
 * @param dir The directory from which to load commands.
 */
export async function loadCommands(dir: string) {
  if (!fs.existsSync(dir)) {
    return []
  }

  const commands = await fs.readdir(dir)
  return commands.map(filename =>
    normalizeCommand({ src: path.join(dir, filename) })
  )
}

function normalizeCommand({ src }: { src: string }): Command {
  return {
    src,
    name: `wumpy_command_${path
      .basename(src)
      .split('.')
      .slice(0, -1)
      .join('.')}_${hash(src)}`
  }
}
