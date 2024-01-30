const { ActivityType, PermissionsBitField } = require("discord.js");

async function checkNonStreamingMembers(client, skippedGuilds) {
    for (const guild of client.guilds.cache.values()) {
        if (skippedGuilds.has(guild.id)) {
            console.log('\x1b[90m%s\x1b[0m', `Skipping because setup failed ${guild.name}`);
            continue;
        }

        try {
            console.log('\x1b[90m%s\x1b[0m', `Checking... ${guild.name}`);

            const botMember = guild.members.cache.get(client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                console.log('\x1b[31m%s\x1b[0m', `Bot does not have 'ManageRoles' permission in ${guild.name}`);
                continue;
            }

            const members = await guild.members.fetch();
            for (const member of members.values()) {
                if (!member.user.bot && member.presence?.activities) {
                    for (const activity of member.presence.activities) {
                        if (activity.type === ActivityType.Streaming) {
                            let role = guild.roles.cache.find(r => r.name === "Live");
                            if (!role) continue; // Skip if role not found

                            //console.log(`${member.user.tag} is 'Live', attempting to add role.`);
                            try {
                                await member.roles.add(role);
                                console.log('\x1b[32m%s\x1b[0m', `'Live', role added to ${member.user.tag}!`);
                            } catch (error) {
                                if (error.code === 50013) {
                                    try {
                                        console.error('\x1b[31m%s\x1b[0m', `Missing permissions to use 'Live' role in ${guild.name}`);
                                        const owner = await guild.fetchOwner();
                                        skippedGuilds.add(guild.id);
                                        await owner.send("I am missing permission to assign and use 'Live' roles to streaming members. Please update my permissions and run `/setup`. Use /help if you need assistance!");
                                    } catch (error) {
                                        console.error('\x1b[31m%s\x1b[0m', `Could not notify the owner of ${guild.name} about missing permissions.`);
                                    }
                                } else {
                                    console.error('\x1b[31m%s\x1b[0m', `Error adding role in ${guild.name}:`, error);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to process guild ${guild.name}:`, error);
        }
    }
}

async function checkCurrentlyStreamingMembers(client, skippedGuilds) {
    for (const guild of client.guilds.cache.values()) {
        if (skippedGuilds.has(guild.id)) {
            console.log('\x1b[90m%s\x1b[0m', `Skipping ${guild.name} because setup failed`);
            continue;
        }

        try {
            console.log('\x1b[90m%s\x1b[0m', `Checking streaming status in ${guild.name}`);

            const botMember = guild.members.cache.get(client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                console.log('\x1b[31m%s\x1b[0m', `Bot lacks 'ManageRoles' permission in ${guild.name}`);
                continue;
            }

            const role = guild.roles.cache.find(r => r.name === "Live");
            if (!role) continue; // Skip if role not found

            const members = await guild.members.fetch();
            for (const member of members.values()) {
                if (member.user.bot || !member.roles.cache.has(role.id)) continue; // Skip bots and members without the 'Live' role

                const isStreaming = member.presence?.activities.some(activity => activity.type === ActivityType.Streaming);

                if (!isStreaming) {
                    try {
                        await member.roles.remove(role);
                        console.log('\x1b[32m%s\x1b[0m', `Removed 'Live' role from ${member.user.tag}`);
                    } catch (error) {
                        console.error('\x1b[31m%s\x1b[0m', `Failed to remove 'Live' role from ${member.user.tag} in ${guild.name}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', `Failed to process streaming status in ${guild.name}:`, error);
        }
    }
}

module.exports = { checkNonStreamingMembers, checkCurrentlyStreamingMembers };