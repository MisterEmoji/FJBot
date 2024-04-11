const { Collection, Client } = require("discord.js");
const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");
const { deployType } = require("./cmd-args.js");

// Be careful to keep this valid
const ROOT_DIR = __dirname.substring(0, __dirname.lastIndexOf("\\"));

module.exports = {
	ROOT_DIRECTORY: ROOT_DIR,
	/**
	 * @returns absolute path of passed command with extension [.js]
	 */
	getPathOfCmd(commandName) {
		const foldersPath = path.join(ROOT_DIR, "commands");
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

	async requestURL(url) {
		return new Promise((resolve, reject) => {
			let buffer = "";

			https
				.get(url, (res) => {
					if (res.statusCode !== 200) {
						reject("Failed to connect: " + url);
						return;
					}

					// sum every data entry
					res.on("data", (chunk) => (buffer += chunk));

					res.on("end", () => {
						resolve(buffer);
					});
				})
				.on("error", (e) => {
					reject("Failed to connect: " + url);
					return;
				});
		});
	},

	/**
	 *
	 * @param {Collection | Array} commands
	 */
	loadCommands(commands) {
		const foldersPath = path.join(ROOT_DIR, "commands");
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
					console.log(
						`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
					);
				}
			}
		}
	},

	/**
	 *
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
