const { ActivityType } = require('discord.js');
const serversWithoutLiveRole = new Set();

module.exports = async (client, before, after) => {
    // Skip if the guild is in the set of servers without a 'Live' role
    if (serversWithoutLiveRole.has(after.guild.id)) {
        return;
    }

    // Find the 'Live' role in the guild
    const role = after.guild.roles.cache.find(r => r.name === "Live");
    if (!role) {
        console.log('\x1b[31m%s\x1b[0m', `'Live' role not found in ${after.guild.name}`);
        serversWithoutLiveRole.add(after.guild.id); // Add to set to prevent future checks
        return;
    }

    // Determine if the member started or stopped streaming
    const wasStreaming = before.presence?.activities.some(activity => activity.type === ActivityType.Streaming);
    const isStreaming = after.presence?.activities.some(activity => activity.type === ActivityType.Streaming);

    try {
        if (isStreaming && !wasStreaming) {
            console.log('\x1b[32m%s\x1b[0m', `Started streaming: ${after.user.tag}`);
            await after.roles.add(role);
        } else if (wasStreaming && !isStreaming) {
            console.log('\x1b[32m%s\x1b[0m', `Stopped streaming: ${after.user.tag}`);
            await after.roles.remove(role);
        }
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Failed to update 'Live' role for ${after.user.tag} in ${after.guild.name}:`, error);
    }
};
