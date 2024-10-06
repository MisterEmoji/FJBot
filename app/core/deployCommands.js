const { Routes } = require("discord.js");

const { getResolvedCommands } = require("./modulesInterface.js");
const { appId } = require("../../common/resolved-config.js");
const rest = require("../../common/dcREST.js");

if (!appId) {
  throw new ReferenceError("Missing 'clientId' field in config.json");
}

/**
 * Deploys slash commands to the Discord API for a given guild.
 *
 * @param {string} guildId The ID of the guild to deploy the commands to.
 * @returns {Promise<void>}
 */
async function deploy(guildId) {
  const commands = (await getResolvedCommands(guildId)).map((cmd) => cmd.data);

  try {
    console.log(
      `[LOG] Started refreshing ${commands.length} application (/) commands on guild id:${guildId} (${process.env.NODE_ENV}).`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(appId, guildId),
      {
        body: commands,
      }
    );

    console.log(
      `[LOG] Successfully reloaded ${data.length} application (/) commands on guild id:${guildId} (${process.env.NODE_ENV}).`
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = deploy;
