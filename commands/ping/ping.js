const { SlashCommandBuilder } = require("discord.js"); // Importowanie CommandBuildera z frameworku

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply("Pong!");
		await interaction.followUp("Pong again!");
		await interaction.followUp("And next Pong again!");
	},
};
