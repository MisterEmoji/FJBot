const { Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { deployType } = require("./arguments.js");
const PWD = require("./pwd.js");

module.exports = {
	/**
	 * @returns absolute path of passed command with extension [.js]
	 */
	getPathOfCmd(commandName) {
		const foldersPath = path.join(PWD, "commands");
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			const commandPath = path.join(foldersPath, folder);
			const isHere = fs.readdirSync(commandPath).includes(commandName + ".js");
			if (isHere) {
				return path.join(commandPath, commandName + ".js");
			}
		}

		return null;
	},
	/**
	 * @param {Collection | Array} commands
	 */
	loadCommands(commands) {
		const foldersPath = path.join(PWD, "commands");
		const commandFolders = fs.readdirSync(foldersPath);

		let pushCmd;
		if (!Array.isArray(commands)) {
			// discord.js Collection
			pushCmd = (cmd) => {
				commands.set(cmd.data.name, cmd);
			};
		} else {
			// Array
			pushCmd = (cmd) => {
				commands.push(cmd.data.toJSON());
			};
		}

		// load commands
		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs
				.readdirSync(commandsPath)
				.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);

				// decide whether command should be deployed on current deployment type
				// no 'deployTarget' is the same as deployTarget = 'both'
				let isDeployed = !command.deployTarget
					? true
					: command.deployTarget === deployType ||
					  command.deployTarget === "both";

				if (!isDeployed) continue;

				// Set a new item in the Collection with the key as the command name and the value as the exported module
				if ("data" in command && "execute" in command) {
					pushCmd(command);
				} else {
				console.log(command);
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				);
				}
			}
		}
	},
};
