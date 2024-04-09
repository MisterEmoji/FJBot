const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// get first custom command-line argument
// (expecting 'public' to indicate that commands should be deployed everywhere)
const isPublicDeploy = process.argv[2]?.toLowerCase() === "public" ? true : false;
const argString = isPublicDeploy ? 'public' : 'private';

if (!token) {
	throw new ReferenceError("Missing 'token' field in config.json");
}
if (!clientId) {
	throw new ReferenceError("Missing 'clientId' field in config.json");
}
if (!guildId && !isPublicDeploy) {
	throw new ReferenceError("Missing 'guildId' field in config.json");
}

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands [${argString}].`
		);

		// The put method is used to fully refresh all commands in the guild or everywhere with the current set
		const data = isPublicDeploy
			? await rest.put(Routes.applicationCommands(clientId), {
					body: commands,
			  })
			: await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
					body: commands,
			  });

		console.log(
			`Successfully reloaded ${data.length} application (/) commands [${argString}].`
		);
	} catch (error) {
		// Make sure you catch and log any errors
		console.error(error);
	}
})();