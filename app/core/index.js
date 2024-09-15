/*
[[ INDEX MODULE ]]

Authors: MisterEmoji, PomPon.
Description: JavaScript module responsible for bot logging in.
Includes: Discord.js [Client, Collection, GatewayIntentBits], Sequelize;
Required Local Modules: utils.js, config-resolver.js

*/

// Turned off for public release
// const Sequelize = require("sequelize");
const config = require("../../common/config-resolver.js").resolve();
const client = require("../modules/client");

const { botToken } = config;

// Verify whether botToken is set
if (!botToken) {
  throw new ReferenceError("Missing 'botToken' field in data/config.json");
}

client.login(botToken);
