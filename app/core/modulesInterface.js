const { Collection } = require("discord.js");
const devConfig = require(global.projectdir + "/config/config.json");
const db = require("../../common/db");
const path = require("path");
const fs = require("node:fs");

function getFileName(file) {
  return file.split(".")[0];
}

/**
 * Loads all commands from all modules in the "modules" directory.
 * Skips loading commands and modules that fail the given skip tests.
 *
 * @param {function(string): boolean} shouldSkipModule - A function which takes a
 *   module name and returns true if the module should be skipped, false otherwise.
 * @param {function(string): boolean} shouldSkipCommand - A function which takes a
 *   command name and returns true if the command should be skipped, false otherwise.
 * @returns {Collection<string, object>} A Collection of commands, where the key is
 *   the command name and the value is the exported module.
 */
function loadCommandsConditionally(shouldSkipModule, shouldSkipCommand) {
  const commands = new Collection();

  // Get all modules in the "modules" directory
  const modulesPath = path.join(global.appdir, "modules");
  const moduleFolders = fs.readdirSync(modulesPath, { withFileTypes: true });

  // Iterate over each module and get its commands
  for (const moduleFolder of moduleFolders) {
    if (!moduleFolder.isDirectory() || shouldSkipModule?.(moduleFolder.name))
      continue;

    const commandFilesPath = path.join(
      modulesPath,
      moduleFolder.name,
      "commands"
    );

    const commandFiles = fs
      .readdirSync(commandFilesPath, { withFileTypes: true })
      .filter((file) => file.isFile() && file.name.endsWith(".js"));

    // Iterate over each command and add it to the collection
    for (const commandFile of commandFiles) {
      if (shouldSkipCommand?.(commandFile.name)) continue;

      const commandPath = path.join(commandFilesPath, commandFile.name);
      const command = require(commandPath);

      // Check if the command has the required properties
      if (!("data" in command && "execute" in command)) {
        console.warn(
          `[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`
        );
        continue;
      }

      commands.set(command.data.name, command);
    }
  }
  return commands;
}

/**
 * Finds the path to a command given its name.
 * @param {string} commandName The name of the command to find.
 * @returns {string | null} The path to the command if found, null otherwise.
 */
function getCommandPath(commandName) {
  const modulesPath = path.join(global.appdir, "modules");
  const moduleFolders = fs.readdirSync(modulesPath, { withFileTypes: true });

  for (const moduleFolder of moduleFolders) {
    if (!moduleFolder.isDirectory()) continue;

    const commandFilePath = path.join(
      modulesPath,
      moduleFolder.name,
      "commands",
      `${commandName}.js`
    );

    if (fs.existsSync(commandFilePath)) return commandFilePath;
  }

  return null;
}

/**
 * Gets the configuration for a command in a guild.
 *
 * @param {string} commandName The name of the command.
 * @param {BigInt} guildId The ID of the guild.
 * @returns {Promise<{ is_disabled: boolean }>} A promise that resolves with
 *   the configuration for the command. If no configuration is found,
 *   the returned object will have `is_disabled` set to `false`.
 */
async function getCommandConfig(commandName, guildId) {
  const command_config = db.fetchSingle(
    await db.query(
      `SELECT  c.is_disabled FROM commands_config AS c INNER JOIN modules_config AS m ON m.id = c.module_config_id WHERE guild_id = $1 AND command_name = $2`,
      [BigInt(guildId), commandName]
    )
  );

  return command_config ?? { is_disabled: false };
}

/**
 * @returns {Collection<string, {data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => Promise<void>}>}
 * A Collection of commands, where the key is
 * the command name and the value is the exported module.
 * @description
 * Resolves all commands in the database as a collection of commands.
 */
function getCommands() {
  return loadCommandsConditionally();
}

/**
 * @param {BigInt} guildId
 * @returns {Collection<string, {data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => Promise<void>}>}
 * @description
 * Resolves all commands as a collection of commands, taking into account the module and command
 * configuration for the given guildId.
 */
async function getResolvedCommands(guildId) {
  const modulesConfig = db.fetchAll(
    await db.query(
      `SELECT id, is_disabled FROM modules_config WHERE guild_id = $1`,
      [BigInt(guildId)]
    )
  );

  const commandsConfig = db.fetchAll(
    await db.query(
      `SELECT m.id, command_name, c.is_disabled FROM commands_config AS c INNER JOIN modules_config AS m ON m.id = c.module_config_id WHERE guild_id = $1`,
      [BigInt(guildId)]
    )
  );

  return loadCommandsConditionally(
    // module skip test
    (moduleName) =>
      modulesConfig.some(
        (config) => config.module_name == moduleName && config.is_disabled
      ) ||
      (moduleName.startsWith("_") && guildId != devConfig.guildId),
    // command skip test
    (commandName) =>
      commandsConfig.some(
        (config) =>
          config.command_name == getFileName(commandName) && config.is_disabled
      )
  );
}
module.exports = {
  getResolvedCommands,
  getCommands,
  getCommandConfig,
  getCommandPath,
};
