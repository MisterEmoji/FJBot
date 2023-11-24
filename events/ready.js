const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.clear();
		console.log("[INFO] Ready! logged in as " + client.user.tag);
		client.user.setActivity("listening...", { type: "WATCHING" });

		// set initial bot presence using presence.json
		const presence = require("./../presence.json");
		client.user.setPresence(presence);
	},
};
