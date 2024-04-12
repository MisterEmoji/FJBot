const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { loadCommands } = require("./utils");
let { deployType } = require("../core/cmd-args");
const { appId, guildId, botToken } =
	require("../core/config-resolver").resolve();

if (!botToken) {
	throw new ReferenceError("Missing 'botToken' field in config.json");
}
if (!appId) {
	throw new ReferenceError("Missing 'clientId' field in config.json");
}
if (!guildId && deployType !== "public") {
	throw new ReferenceError("Missing 'guildId' field in config.json");
}

const commands = [];

loadCommands(commands);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(botToken);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`[LOG] Started refreshing ${commands.length} application (/) commands [${deployType}].`
		);

		// The put method is used to fully refresh all commands in the guild or everywhere with the current set
		const data =
			deployType === "public"
				? await rest.put(Routes.applicationCommands(appId), {
						body: commands,
				  })
				: await rest.put(Routes.applicationGuildCommands(appId, guildId), {
						body: commands,
				  });

		console.log(
			`[LOG] Successfully reloaded ${data.length} application (/) commands [${deployType}].`
		);
	} catch (error) {
		console.error(error);
	}
})();
