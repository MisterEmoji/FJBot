const { Client } = require("discord.js");
const fs = require("fs");
const path = require("node:path");

const PWD = require("./pwd");

module.exports = {
	/**
	 * @param {Client} client
	 */
	loadEvents(client) {
		const eventsPath = path.join(PWD, "events");
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
