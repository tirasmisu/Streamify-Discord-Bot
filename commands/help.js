const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help and instructions for setting up and using the bot'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const helpText = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 Streamify Bot Help')
            .addFields(
                { name: 'Setting Up the Bot:', value: "- Ensure the bot is above most users in the server's role hierarchy.\n- The 'Live' role should also be above the users you want to automatically manage.\n- Make the 'Live' role separated from other roles for better visibility.\n- If the bot cannot create the 'Live' role, please check the bot's role position and permissions.\n- Use `/setup` to try setting up the 'Live' role manually if you encounter issues." },
                { name: 'Using the Bot:', value: "- The bot automatically assigns the 'Live' role to users who are streaming and removes it when they stop.\n- For a list of all available commands, use `/commands`.\n- Enjoy the automated management of streamer roles in your server!" },
                { name: 'Need further assistance or have questions?', value: "Join our support server: [Support Server](https://discord.gg/4NWweN6cx8)" }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [helpText], ephemeral: true });
    }
};
