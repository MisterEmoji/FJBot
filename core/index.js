const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { botToken } = require("./config-resolver.js").resolve();
const { loadCommands, loadEvents } = require("./utils.js");

// verify whether botToken is set
if (!botToken) {
	throw new ReferenceError("Missing 'botToken' field in data/config.json");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// load commands
loadCommands(client.commands);

// load events
loadEvents(client);

client.login(botToken);
