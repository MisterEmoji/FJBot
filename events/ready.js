const { Events } = require("discord.js");
const profile = require("./../profile.json");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[INFO] Ready! logged in as ${client.user.tag}`);
		client.user.setPresence(profile.presence);
	},
};
