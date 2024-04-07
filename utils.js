const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

module.exports = {
	/**
	 * @returns absolute path of passed command with extension [.js]
	 */
	getPathOf(commandName) {
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
	},

	async readFileFromURL(url) {
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
};
