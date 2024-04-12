const { Client, Collection, GatewayIntentBits } = require("discord.js");
const Sequelize = require("sequelize");
const config = require("./config-resolver.js").resolve();
const { loadCommands, loadEvents } = require("./utils.js");

const { botToken } = config;
const { host, user, password, dbname } = config.database;

// verify whether botToken is set
if (!botToken) {
	throw new ReferenceError("Missing 'botToken' field in data/config.json");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// create nwe db connection
const connection = new Sequelize(dbname, user, password, {
	host: host,
	dialect: "postgres",
	logging: false,
});

// Sequelize handles error by its own
connection
	.authenticate()
	.then(() => console.log("[LOG] Connected to the database."));


client.commands = new Collection();

// load commands
loadCommands(client.commands);

// load events
loadEvents(client);

client.login(botToken);
