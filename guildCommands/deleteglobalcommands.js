const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteglobalcommands')
        .setDescription('Deletes all global commands (Owner only)'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        // Hardcoded owner ID for security
        const ownerId = '131493332290502656';

        // Check if the user is the bot owner
        if (interaction.user.id !== ownerId) {
            await interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true });
            return;
        }

        try {
            // Fetch all global commands
            const commands = await interaction.client.application?.commands.fetch();

            // Loop through the commands and delete them
            const deletionPromises = commands.map(command => interaction.client.application?.commands.delete(command));
            await Promise.all(deletionPromises);

            await interaction.reply({ content: 'All global commands have been deleted.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while deleting the commands.', ephemeral: true });
        }
    }
};

