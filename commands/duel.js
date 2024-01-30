const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('Challenge another member to a duel')
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('The member you want to duel')
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const initiator = interaction.user;
        const opponent = interaction.options.getMember('opponent');

        if (initiator.id === opponent.id) {
            await interaction.reply({ content: "You can't duel yourself!", ephemeral: true });
            return;
        }

        const winner = Math.random() < 0.5 ? initiator : opponent;
        await interaction.reply(
            `⚔️ ${initiator} challenges ${opponent} to a duel! The winner is ${winner}!`
        );
    }
};
