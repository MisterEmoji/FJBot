const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Checks bot reaction time."),
	async execute(interaction) {
		await interaction.reply(
			`Ping: \`${Date.now() - interaction.createdTimestamp}ms\``
		);
	},
};
