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
const rolesSelectionMessage = require("../messages/roles-selection.js");

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

const client = require("../modules/client");

client.login(botToken).then(async () => {
	rolesSelectionMessage.constructAndSend(
		client,
		"1174001410833129573",
		"1247208326350241914",
		new Map([
			["1177693023455416490", "🎩"],
			["1231009480083378248", "😀"],
		])
	);
});

	// // [temp]
	// // this comment section contains test code for roles select component

	// .then(async () => {
	// 	const ch = await client.channels.fetch("1247208326350241914");
	// 	const roles = await (
	// 		await client.guilds.fetch("1174001410833129573")
	// 	).roles.fetch();

	// 	const message = new ActionRowBuilder().addComponents(
	// 		new RolesSelectComponentBuilder()
	// 			.setCustomId("roles")
	// 			.setMinValues(0)
	// 			.setMaxValues(2)
	// 			.addOptions(
	// 				roles.map((role) => {
	// 					return { role: { ...role }, emoji: "🧡" };
	// 				})
	// 			)
	// 	);
	// 	ch.send({ content: "Choose your roles!", components: [message] });
	// });
