const { Client, Collection, GatewayIntentBits } = require("discord.js");

const { loadCommands } = require("../core/utils/commands");
const { loadEvents } = require("../core/utils/events");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

loadCommands(client.commands);

loadEvents(client);

module.exports = client;
