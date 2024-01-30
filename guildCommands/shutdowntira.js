const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

const OWNER_ID = '131493332290502656'; // Replace with your Discord user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdowntira')
        .setDescription('Shuts down the bot'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        // Check if the author is the bot owner
        if (interaction.user.id !== OWNER_ID) {
            await interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true });
            return;
        }

        console.log("Shutting down and removing 'Live' roles...");
        // Shutdown logic
        for (const guild of interaction.client.guilds.cache.values()) {
            const role = guild.roles.cache.find(r => r.name === "Live");
            if (role) {
                // Filter members who have the 'Live' role
                const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
                for (const member of membersWithRole.values()) {
                    try {
                        await member.roles.remove(role);
                        console.log(`Removed 'Live' role from ${member.user.tag} in ${guild.name}.`);
                    } catch (error) {
                        console.error(`Failed to remove 'Live' role from ${member.user.tag} in ${guild.name}:`, error);
                    }
                }
            }
        }

        await interaction.reply({ content: "Shutting down...", ephemeral: true });
        // Delay the shutdown to ensure that the reply is sent
        setTimeout(() => interaction.client.destroy(), 1000);
    }
};