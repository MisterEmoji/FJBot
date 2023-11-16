const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log("[INFO] Ready! logged in as " + client.user.tag);
	},
};
