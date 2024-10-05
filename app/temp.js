const { Collection } = require("discord.js");
const db = require("../common/db");
const { loadCommandsFrom } = require("./utilities/commands");
const pwd = require("./utilities/pwd");
const path = require("path");
const fs = require("node:fs");

function getFileName(file) {
  return file.split(".")[0];
}

async function resolve(guildId) {
  const modules_config = db.fetchAll(
    await db.query(
      `SELECT id, is_disabled FROM modules_config WHERE guild_id = $1`,
      [BigInt(guildId)]
    )
  );

  const commands_config = db.fetchAll(
    await db.query(
      `SELECT m.id, command_name, c.is_disabled FROM commands_config AS c INNER JOIN modules_config AS m ON m.id = c.module_config_id WHERE guild_id = $1`,
      [BigInt(guildId)]
    )
  );

  console.log(modules_config);
  console.log(commands_config);

  const commands = new Collection();

  const modulesPath = path.join(pwd, "app/modules");
  const moduleFolders = fs.readdirSync(modulesPath);

  for (const moduleName of moduleFolders) {
    // skip iteration if this module is disabled
    if (
      commands_config.some(
        (config) => config.module_name == moduleName && config.is_disabled
      )
    ) {
      continue;
    }

    const commandsPath = path.join(modulesPath, moduleName, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((moduleName) => moduleName.endsWith(".js"));

    for (const file of commandFiles) {
      // skip iteration if this command is disabled
      if (
        commands_config.some(
          (config) =>
            config.command_name == getFileName(file) && config.is_disabled
        )
      ) {
        continue;
      }

      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      // Set a new item in the Collection with the key as the command name and the value as the exported moduleName
      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(command);
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  console.log(commands);
}

// test
resolve("1174001410833129573");

module.exports = resolve;
