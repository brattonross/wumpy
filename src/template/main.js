import { Client } from 'discord.js'

(async () => {
  const commands = await Promise.all([
    <% commands.forEach(command => { %>() => import('<%= command.name %>'),
    <% }) %>
  ])
  
  const client = new Client()
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })
  
  client.login('<%= botToken %>')
})()
