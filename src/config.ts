import dotenv from 'dotenv'
import fs from 'fs-extra'
import path from 'path'

export interface Config {
  /**
   * Root directory of the project.
   * @default process.cwd()
   */
  root?: string
  /**
   * Directory relative to `root` that the pre-bundled app is written to.
   * @default '.wumpy'
   */
  buildDir?: string
  /**
   * Directory relative to `root` that the bundled app is written to.
   * @default 'out'
   */
  outDir?: string
  /**
   * The token of the Discord bot user.
   */
  botToken: string
  /**
   * Config related to commands.
   */
  commands?: {
    /**
     * Directory relative to `root` that commands will be loaded from.
     * @default 'commands'
     */
    dir?: string
    /**
     * Prefix that a message must have to be considered a command.
     * @default '!'
     */
    prefix?: string
  }
}

/**
 * Loads wumpy configuration.
 * If any required keys are missing, the process will exit.
 * Configuration is loaded from the `wumpy.config.js` and `.env` files.
 */
export async function loadConfig(): Promise<Config> {
  const cwd = process.cwd()
  const configPath = path.resolve(cwd, 'wumpy.config.js')
  let config: Config | undefined

  try {
    if (fs.existsSync(configPath)) {
      config = await import(configPath)
    }

    config = {
      root: process.cwd(),
      buildDir: '.wumpy',
      outDir: 'out',
      botToken: '',
      ...config
    }

    if (fs.existsSync(path.join(config.root!, '.env'))) {
      const env = loadEnv()
      if (env.WUMPY_BOT_TOKEN) {
        config.botToken = env.WUMPY_BOT_TOKEN
      }
    }

    // Check any required keys
    if (!config.botToken) {
      throw new Error('Missing required config option "botToken".')
    }

    if (config.root && !path.isAbsolute(config.root)) {
      config.root = path.resolve(path.dirname(configPath), config.root)
    }

    return config
  } catch (err) {
    console.error(`[wumpy] Failed to load config from ${configPath}:`)
    console.error(err)
    process.exit(1)
  }
}

function loadEnv(): Record<string, string> {
  const result = dotenv.config()
  if (result.error) {
    throw result.error
  }
  return Object.assign({}, result.parsed)
}
