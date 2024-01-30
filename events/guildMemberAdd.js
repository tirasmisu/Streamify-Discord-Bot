const { PermissionsBitField, ActivityType } = require("discord.js");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (member.user.bot) return; // Skip bots

        const botMember = await member.guild.members.fetch(member.client.user.id);
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            console.log(`Bot does not have 'ManageRoles' permission in ${member.guild.name}`);
            return; // Exit if no permission to manage roles
        }

        const role = member.guild.roles.cache.find(r => r.name === "Live");
        if (!role) return; // Exit if 'Live' role doesn't exist

        // Delay to potentially allow for presence information to update
        setTimeout(async () => {
            if (member.presence?.activities?.some(activity => activity.type === ActivityType.Streaming)) {
                try {
                    await member.roles.add(role);
                    console.log(`Assigned 'Live' role to new streaming member ${member.user.tag}.`);
                } catch (error) {
                    console.error(`Failed to add 'Live' role in ${member.guild.name}:`, error);
                }
            }
        }, 1000 * 10); // Wait for 10 seconds before checking streaming status
    },
};
