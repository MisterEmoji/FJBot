const { Client } = require("discord.js");

module.exports = {
	/**
	 * @param {Client} client
	 */
	loadEvents(client) {
		const eventsPath = path.join(ROOT_DIR, "events");
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith(".js"));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
	},
};
