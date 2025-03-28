# FJBot
FJBot - Discord bot, another copy of Dyno. It's created for everything and nothing at once.

> [!NOTE]
> This application is still under development, and may include some bugs, performence issues and some functions may be disabled.

## Discord.JS Framework

This bot has been developed with use of the [Discord.js](https://discord.js.org/) framework.

## Commands
Commands are separated to groups:
- Dev (available only for bot developers):
  - reload: reload given command:
- Moderation:
  - ban: bans given user from server.
  - unban: unbans given user from server.
  - kick: kicks given user from server.
  - timeout: mute user revoking his writing permissions.
  - clear: clear chat history in given amount of last messages.
- Misc:
  - ping: checks ping between bot and command executor.
  - server: gives details about the server where command is executed.
  - user: gives details about the provided user.
- Web:
  - www-search: allows searching for various things from the net (also photos).

`More in production...`

## Database connection

> Feature not available in public release due to database host dependencies being unavailable.

Database connection allows to connect bot to PostgreSQL database. Feature is currently unavailable and will be provided in future releases among with web admin panel.

## Commands reloading

> Feature available only for developers

Bot system allows to reload command module. In this way bot doesn't need to be restarted everytime command module has been modified by developer.

## Authors
- [@MisterEmoji](https://github.com/MisterEmoji) 
- [@PomPonn](https://github.com/PomPonn)
