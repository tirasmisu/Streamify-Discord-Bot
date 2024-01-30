const setupGuild = require('../utils/setupGuild');

module.exports = async (client, guild) => {
    try {
        const role = await setupGuild(guild);
        if (!role) {
            console.log(`Failed to setup 'Live' role in ${guild.name}.`);
            // Additional logic can be added here if the setup fails
        } else {
            console.log(`Setup completed in ${guild.name}.`);
            // Additional logic for the guild setup can be added here
        }
    } catch (error) {
        console.error(`Error in guildCreate event in ${guild.name}:`, error);
    }
};
