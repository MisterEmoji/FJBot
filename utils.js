const fs = require("node:fs");
const path = require("node:path");

/**
 *
 * @param {*} commandName
 * @returns absolute path of passed command with extension [.js]
 */
const getPathOf = (commandName) => {
	const foldersPath = path.join(__dirname, "commands");
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandPath = path.join(foldersPath, folder);
		const isHere = fs.readdirSync(commandPath).includes(commandName + ".js");
		if (isHere) {
			return path.join(commandPath, commandName + ".js");
		}
	}

	return null;
};

module.exports = getPathOf;
