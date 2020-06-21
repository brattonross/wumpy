<% commands.forEach(command => { %>import * as <%= command.alias %> from '<%= command.alias %>'
<% }) %>
const noop = () => {}

function normalizeCommand(command, { name }) {
  return {
    name: command.name || name,
    run: typeof command.run === 'function' ? command.run : noop
  }
}

export const commands = [
  <% commands.forEach(command => { %>normalizeCommand(<%= command.alias %>, { name: '<%= command.name %>' })
  <% }) %>
]
