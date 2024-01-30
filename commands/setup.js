const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const setupGuild = require('../utils/setupGuild'); // Adjust the path to your utility function as needed
const serversWithoutLiveRole = new Set(); // This should be moved to a shared state if used across multiple files

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up the bot in the server'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply({ content: "This command must be used in a server.", ephemeral: true });
            return;
        }

        try {
            const role = await setupGuild(guild);
            if (role) {
                serversWithoutLiveRole.delete(guild.id);
                await interaction.reply({ content: `'Live' role is set up in ${guild.name}.`, ephemeral: true });
            } else {
                serversWithoutLiveRole.add(guild.id);
                await interaction.reply({
                    content: `Failed to set up 'Live' role in ${guild.name}. Please check the bot's permissions and role position.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            if (error.code === 50013) { // Error code for missing permissions
                await interaction.reply({
                    content: "Setup failed: insufficient permissions. Please ensure the bot has the following permissions: \n- Manage Roles\n- View Channels\n- Send Messages\n- Add Reactions\n- Use Slash Commands",
                    ephemeral: true
                });
            } else {
                await interaction.reply({ content: `An unexpected error occurred: ${error}`, ephemeral: true });
            }
        }
    }
};
