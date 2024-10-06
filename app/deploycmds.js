require("../common/envsetup.js");

const { REST, Routes } = require("discord.js");

const { getCommands } = require("./core/modulesInterface.js");
const db = require("../common/db.js");
const { appId, guildId, botToken } = require("../common/envconfig.js");

if (!botToken) {
  throw new ReferenceError("Missing 'botToken' field in config.json");
}
if (!appId) {
  throw new ReferenceError("Missing 'clientId' field in config.json");
}
if (!guildId && process.env.NODE_ENV !== "prod") {
  throw new ReferenceError("Missing development'guildId' field in config.json");
}

const commands = Array.from(getCommands().values());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(botToken);
db.start();

// deploy commands
(async () => {
  try {
    console.log(
      `[LOG] Started refreshing ${commands.length} application (/) commands on ${process.env.NODE_ENV} instance.`
    );

    // TODO: rework here

    // The put method is used to fully refresh all commands in the guild or everywhere with the current set
    const data =
      process.env.NODE_ENV === "prod"
        ? await rest.put(Routes.applicationCommands(appId), {
            body: commands,
          })
        : await rest.put(Routes.applicationGuildCommands(appId, guildId), {
            body: commands,
          });

    console.log(
      `[LOG] Successfully reloaded ${data.length} application (/) commands on ${process.env.NODE_ENV} instance.`
    );
  } catch (error) {
    console.error(error);
  } finally {
    db.end();
  }
})();
