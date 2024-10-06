const { REST } = require("discord.js");
const { botToken } = require("../common/resolved-config.js");

module.exports = new REST().setToken(botToken);
