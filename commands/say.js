const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send a message to the current channel')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const message = interaction.options.getString('message');

        // Check if the author is the bot owner
        if (interaction.user.id != 131493332290502656) {
            await interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true });
            return;
        }

        // Grabbing the channel from the interaction context
        const channel = interaction.channel;
        if (!channel || !channel.isTextBased()) {
            await interaction.reply({ content: "Channel not found or not a text channel", ephemeral: true });
            return;
        }

        await channel.send(message);
        console.log(`Message sent to ${channel.name}, with the message:\n${message}`);
        await interaction.reply({ content: `Message sent to ${channel.name}`, ephemeral: true });
    }
};
