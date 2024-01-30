const { Events, ActivityType } = require('discord.js');
const { checkNonStreamingMembers, checkCurrentlyStreamingMembers } = require('../utils/roleUtils');
const setupGuild = require('../utils/setupGuild'); // Adjust the path as necessary

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        const activity = {
            name: "/help to get started with your server :)",
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/bufftv"
        };

        client.user.setPresence({ activities: [activity] });

        const skippedGuilds = new Set();

        console.log('\x1b[90m%s\x1b[0m', `[INFO] Setting up guilds...\n`);
        for (const guild of client.guilds.cache.values()) {
            const success = await setupGuild(guild);
            if (!success) {
                //console.log(`Skipping further setup due to set up failure in ${guild.name}`);
                try {
                    const owner = await guild.fetchOwner();
                    skippedGuilds.add(guild.id);
                    await owner.send("I need the 'Manage Roles' permission to assign 'Live' roles to streaming members. Please update my permissions and run `/setup`.");
                } catch (error) {
                    console.error('\x1b[31m%s\x1b[0m', `Could not notify the owner of ${guild.name} about missing permissions.`);
                }
            }

            // Any additional setup logic for the guild can go here
        }

        console.log('\x1b[90m%s\x1b[0m', `[INFO] Guild setup complete!\n`);

        console.log('\x1b[32m%s\x1b[0m', `Ready! Logged in as ${client.user.tag}\n`);

        console.log('\x1b[90m%s\x1b[0m', `[INFO] Displaying all users who are currently Streaming\n`);

        await checkNonStreamingMembers(client, skippedGuilds);

        console.log('\x1b[90m%s\x1b[0m', `[INFO] checkNonStreamingMembers complete!`);

        console.log('\x1b[90m%s\x1b[0m', `\n[INFO] Displaying all users who are aren't who were Streaming\n`);

        await checkCurrentlyStreamingMembers(client, skippedGuilds);

        console.log('\x1b[90m%s\x1b[0m', `[INFO] checkCurrentlyStreamingMembers complete!`);

        console.log('\x1b[32m%s\x1b[0m', '\n[INFO] DONE!\n');
    },
};
