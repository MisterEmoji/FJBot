const {
	SlashCommandBuilder,
	ApplicationCommandPermissionType,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Checks bot reaction time."),
	async execute(interaction) {
		// try to hide the global commands on specific server(s)
		// inspect and review this (returns error: '401: Unauthorized')
		// interaction.client.application.commands.permissions
		// 	.set({
		// 		command: "1231007349465022505",
		// 		guild: "1174001410833129573",
		// 		token:
		// 			"MTIyNzY4MDE4NzMwNzUyNDEyNg.GxXfEn.KXaAifgjVVTWq4OT8TpaGoF64Y5etghow8r5sM",
		// 		permissions: [
		// 			{
		// 				id: 1174001410833129573,
		// 				type: ApplicationCommandPermissionType.Role,
		// 				permission: false,
		// 			},
		// 		],
		// 	})
		// 	.then(console.log);

		await interaction.reply(
			`Ping: \`${Date.now() - interaction.createdTimestamp}ms\``
		);
	},
};
