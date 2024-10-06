require("../common/envsetup.js");

const { Routes } = require("discord.js");
const rest = require("../common/dcREST.js");
const db = require("../common/db.js");

const deployCmds = require("../app/core/deployCommands.js");

(async () => {
  db.start();

  const guilds = await rest.get(Routes.userGuilds());

  for (const guild of guilds) {
    await deployCmds(guild.id);
  }

  db.end();
})();
