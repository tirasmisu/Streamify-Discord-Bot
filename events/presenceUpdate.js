const { ActivityType, PermissionsBitField } = require("discord.js");
const serversWithoutLiveRole = new Set();

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence) {
        //console.log('Presence update detected.');
        if (serversWithoutLiveRole.has(newPresence.guild.id)) {
            return;
        }

        const member = newPresence.member;
        if (member.user.bot) return; // Skip bots

        const role = member.guild.roles.cache.find(r => r.name === "Live");
        if (!role) {
            console.log('\x1b[31m%s\x1b[0m', `'Live' role not found in ${member.guild.name}`);
            serversWithoutLiveRole.add(newPresence.guild.id);
            return; // Exit if 'Live' role doesn't exist
        }

        const botMember = await member.guild.members.fetch(member.client.user.id);
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            console.log('\x1b[31m%s\x1b[0m', `Bot lacks 'ManageRoles' permission in ${member.guild.name}`);
            serversWithoutLiveRole.add(newPresence.guild.id);
            return; // Exit if no permission to manage roles
        }

        const wasStreaming = oldPresence ? oldPresence.activities.some(activity => activity.type === ActivityType.Streaming) : false;
        const isStreaming = newPresence.activities.some(activity => activity.type === ActivityType.Streaming);

        if (isStreaming && !wasStreaming) {
            try {
                await member.roles.add(role);
                console.log('\x1b[32m%s\x1b[0m', `Assigned 'Live' role to streaming member ${member.user.tag}.`);
            } catch (error) {
                console.error('\x1b[31m%s\x1b[0m', `Error assigning 'Live' role to ${member.user.tag} in ${member.guild.name}:`, error);
            }
        } else if (!isStreaming && wasStreaming) {
            try {
                await member.roles.remove(role);
                console.log('\x1b[32m%s\x1b[0m', `Removed 'Live' role from member ${member.user.tag}.`);
            } catch (error) {
                console.error('\x1b[31m%s\x1b[0m', `Error removing 'Live' role from ${member.user.tag} in ${member.guild.name}:`, error);
            }
        }
    },
};
