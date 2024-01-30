# Streamify Discord Bot

## Introduction
Streamify is a Discord bot designed to enhance the experience of streamers and their communities on Discord servers. It automatically identifies users who are streaming and applies a "Live" role to them, making it easier for others to notice and join their streams.

## Key Features
- **Automatic "Live" Role Assignment:** Streamify creates a "Live" role in the server and assigns it to users who are streaming, hoisting them above other users for visibility.
- **Custom Commands:** Streamify offers a mix of useful and fun commands. Some commands are reserved for the bot owner and some for guild-specific use.
- **Guild Commands:** Designed for single-server use, these commands include testing and exclusive features like a shutdown command that can turn off the bot.

## Commands List
- `commands`: List all available commands.
- `duel`: Initiate a fun duel with other users.
- `help`: Get help with bot commands and features.
- `setup`: Configure bot settings for the server.
- `ping`: Check the bot's response time.
- `say`: Broadcast a message (restricted to the bot owner).

## Setup and Configuration
Before using Streamify, ensure you have the following prerequisites:

1. **Node.js and Discord.js:** Install Node.js and Discord.js libraries.
2. **NPM:** Ensure npm (Node Package Manager) is installed.

### Creating a .env File
You need to create a `.env` file in your bot's directory with the following structure:

```
TOKEN=(your discord bot's token)
CLIENT_ID=(your discord bot's client id)
GUILD_ID=(your discord server ID for deploying guild commands)
```

Replace the placeholders with your actual Discord bot token, client ID, and guild ID.

### Important Notes
- **Remove Hardcoded IDs:** Ensure to remove or replace hardcoded IDs in commands like `/say` to prevent unauthorized use.
- **Bot Permissions:** Make sure Streamify has the necessary permissions on your Discord server for its features to work correctly.

## Getting Started
Once you have completed the setup, you can start using Streamify on your server. Use the `/help` command for guidance on using the bot's features.

## Support
For support, questions, or feedback, please [join the discord](https://discord.gg/4NWweN6cx8).
