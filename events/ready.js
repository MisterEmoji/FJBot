const { Events } = require("discord.js");
const profile = require("./../data/profile.json");
const { deployType } = require("../core/cmd-args");

// in miliseconds
const PRESENCE_INTERVAL = 5000;

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[STATUS] Ready!`);
		console.log(`[STATUS] Logged in as (${deployType}) ${client.user.tag}`);

		// tracks currently displayed presence index
		// randomize on start
		let presenceIndex = Math.floor(Math.random() * profile.presences.length);

		// define presence handler ...
		(switchPresence = () => {
			client.user.setPresence(profile.presences[presenceIndex]);

			presenceIndex++;
			// go back to the first one if reached the end
			if (presenceIndex === profile.presences.length) {
				presenceIndex = 0;
			}
		})(); // ... and invoke it to see the presence immidiately

		// change bot presence every PRESENCE_INTERVAL miliseconds
		setInterval(switchPresence, PRESENCE_INTERVAL);
	},
};
