require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events} = require('discord.js');
const setupGuild = require('./utils/setupGuild'); // Adjust the path as needed


const token = process.env.TOKEN;
//const clientId = process.env.CLIENT_ID;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // This one is a privileged intent and must be enabled in the Discord Developer Portal.
        GatewayIntentBits.GuildMembers,   // This one is also a privileged intent.
        GatewayIntentBits.GuildPresences, // And this one.
    ],
});

client.on(Events.GuildCreate, async guild => {
    console.log('\x1b[32m%s\x1b[0m', `Joined new guild: ${guild.name}`);
    try {
        const setupResult = await setupGuild(guild);
    } catch (error) {
        console.error(`Error during setup in ${guild.name}:`, error);
    }
});


client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    // Handle updates to guild members, such as role changes or presence updates
    console.log('\x1b[32m%s\x1b[0m', `${newMember.user.tag} updated in guild: ${newMember.guild.name}`);
    // Implement logic based on old and new member details
});

console.log('\x1b[90m%s\x1b[0m', `\n[INFO] Loading in commands.\n`);

client.commands = new Collection();

let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);

    if (fs.statSync(commandsPath).isDirectory()) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Use the file name without '.js' as the command name
            const commandName = path.basename(file, '.js');

            if ('data' in command && 'execute' in command) {
                client.commands.set(commandName, command);
                console.log('\x1b[90m%s\x1b[0m', `${commandName} loaded`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    } else {
        // If it's a file at the root of the commands directory, just require it directly
        const command = require(commandsPath);
        const commandName = path.basename(folder, '.js');

        if ('data' in command && 'execute' in command) {
            client.commands.set(commandName, command);
            console.log('\x1b[90m%s\x1b[0m', ` - ${commandName} loaded!`);
        } else {
            console.log(`[WARNING] The command at ${commandsPath} is missing a required "data" or "execute" property.`);
        }
    }
}

foldersPath = path.join(__dirname, 'guildCommands');
commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const command = require(commandsPath);
    const commandName = path.basename(folder, '.js');

    if ('data' in command && 'execute' in command) {
        client.commands.set(commandName, command);
        console.log('\x1b[90m%s\x1b[0m', ` - ${commandName} loaded! [GUILD COMMAND]`);
    } else {
        console.log(`[WARNING] The command at ${commandsPath} is missing a required "data" or "execute" property.`);
    }
}

console.log('\x1b[90m%s\x1b[0m', `\n[INFO] All commands loaded.\n`);

const eventsPath = path.join(__dirname, 'events');
let eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(token).catch(error => {
    console.error("Failed to log in:", error);
});
