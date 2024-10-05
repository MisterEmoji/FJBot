const { Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  /**
   * @param {Collection | Array} commands
   */
  loadCommandsFrom(basePath) {
    const commandFolders = fs.readdirSync(basePath);
    console.log(commandFolders);
    const commands = new Collection();

    const pushCmd = (cmd) => {
      commands.set(cmd.data.name, cmd);
    };

    // load commands
    for (const folder of commandFolders) {
      if (folder.endsWith(".js")) continue;

      const commandsPath = path.join(basePath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

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
    return commands;
  },
};
