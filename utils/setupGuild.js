const {Colors } = require('discord.js');

module.exports = async guild => {
    try {
        let role = guild.roles.cache.find(r => r.name === "Live");
        if (!role) {
            role = await guild.roles.create({
                name: 'Live',
                color: Colors.Purple, // Optional: Set a color for the role
                permissions: [], // Optional: Set specific permissions for the role
                reason: 'Role for live streamers',
                hoist: true // Optional: Set to true if you want this role to be displayed separately in the member list
            });
            console.log('\x1b[32m%s\x1b[0m', `Created "Live" role in ${guild.name}`);
        } else {
            console.log('\x1b[90m%s\x1b[0m', `"Live" role already exists in ${guild.name}`);
        }
        return true; // Indicates success
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Failed to create 'Live' because of ${error} in ${guild.name}: `);
        return false; // Indicates failure
    }
};
