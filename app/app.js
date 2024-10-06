/*
[[ APP MODULE ]]

Authors: MisterEmoji, PomPon.
Description: JavaScript module responsible for bot logging in.
Includes: Discord.js [Client, Collection, GatewayIntentBits], Sequelize;
Required Local Modules: utils.js, config-resolver.js

*/

const { botToken } = require("../common/envconfig.js");
const client = require("./core/client.js");

// Verify whether botToken is set
if (!botToken) {
  throw new ReferenceError("Missing 'botToken' field in data/config.json");
}

client.login(botToken);
