const { Events } = require("discord.js");
const profile = require("./../profile.json");

let interval = 0;

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[STATUS] Ready!`);
		console.log(`[STATUS] Logged in as ${client.user.tag}`);
		setInterval(() => {
			client.user.setPresence(profile.presence);
			setTimeout(() => {
				client.user.setPresence(profile.presence2);
			}, 5000);
			setTimeout(() => {
				client.user.setPresence(profile.presence3);
			}, 10000);
		}, 15000);
	},
};
