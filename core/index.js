/*
[[ INDEX MODULE ]]

Authors: MisterEmoji, PomPon.
Description: JavaScript module responsible for bot logging in.
Includes: Discord.js [Client, Collection, GatewayIntentBits], Sequelize;
Required Local Modules: utils.js, config-resolver.js

*/

// Turned off for public release
// const Sequelize = require("sequelize");
const config = require("./config-resolver.js").resolve();
const client = require("../modules/client");

const { botToken } = config;

// Verify whether botToken is set
if (!botToken) {
	throw new ReferenceError("Missing 'botToken' field in data/config.json");
}

/*	Database connection part, marked as comment for public release

// create nwe db connection
const connection = new Sequelize(dbname, user, password, {
	host: host,
	dialect: "postgres",
	logging: false,
});

// Sequelize handles errors by its own
connection
	.authenticate()
	.then(() => console.log("[LOG] Connected to the database."));


*/

client.login(botToken);