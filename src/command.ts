import fs from 'fs-extra'
import hash from 'hash-sum'
import path from 'path'

export interface Command {
  alias: string
  name: string
  src: string
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
  return commands.map(filename => {
    const name = basename(filename)
    return normalizeCommand({ src: path.join(dir, filename), name })
  })
}

function normalizeCommand({
  src,
  name
}: {
  src: string
  name: string
}): Command {
  return {
    name,
    src,
    alias: `wumpy_command_${basename(src)}_${hash(src)}`
  }
}

function basename(src: string) {
  return path.basename(src).split('.').slice(0, -1).join('.')
}
