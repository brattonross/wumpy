import { Client } from 'discord.js'
import { commands } from './commands'
;(async () => {
  const client = new Client()

  client.on('message', message => {
    if (!message.content.startsWith('<%= prefix %>') || message.author.bot) {
      return
    }

    const content = message.content.slice(1)
    const args = content.split(' ')
    for (const command of commands) {
      if (args[0] && args[0].toLowerCase() === command.name.toLowerCase()) {
        command.run(message)
        return
      }
    }
  })

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.login('<%= botToken %>')
})()
