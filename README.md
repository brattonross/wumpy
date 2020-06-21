# wumpy

Wumpy is a minimal framework built on top of [discord.js](https://github.com/discordjs/discord.js).

Inspired by the Next.js and Nuxt.js frameworks, wumpy uses a convention over configuration approach.

This project is a way for me to attempt to understand how frameworks like these work under the hood.

## Getting Started

Install `wumpy` in your project:

```bash
npm install wumpy
```

Or if using Yarn:

```bash
yarn add wumpy
```

Add a build script to your `package.json`:

```json
"scripts": {
  "build": "wumpy build"
}
```

A wumpy bot doesn't do much without commands. A command is simply a function that is exported from a `.js` file in the `commands` directory.

By default, a command's trigger is based off of its file name. For example `commands/ping.js` will be triggered by a message starting with `!ping`.

Create a `commands` directory inside of your project.

Create the `ping.js` file in the `commands` directory, and populate it with the following:

```js
export function run(message) {
  message.channel.send('pong')
}
```

Build your app by running `npm run build`. This will build your app to the `out` directory.

You can then run your bot as you would any other node program. Run the following in your terminal:

```bash
node ./out/main.js
```
