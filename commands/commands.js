const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('List specific available commands'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const commandsText = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🔍 Available Commands')
            .setDescription("Here's a list of commands you can use:")
            .addFields(
                //{ name: 'Bot Creator Reserved Commands:', value: "- `!shutdowntira`: Shuts down the bot.\n- `!say`: Send a message to the current channel." },
                { name: 'General Commands:', value: "- `/help`: Get help and instructions for setting up and using the bot.\n- `/setup`: Set up the bot in the server.\n- `/duel`: Challenge another member to a duel.\n- `/commands`: List specific available commands." },
                //{ name: 'Note:', value: "*Some commands may have restrictions on who can use them.*" }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [commandsText], ephemeral: true });
    }
};
