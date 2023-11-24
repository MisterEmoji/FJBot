const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log("[INFO] Ready! logged in as " + client.user.tag);
		client.user.setActivity("listening...", { type: "WATCHING" });

		// set initial bot presence using profile.json
		const presence = require("./../profile.json").presence;
		client.user.setPresence(presence);
	},
};
