const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

let serverInfoEmbed = new EmbedBuilder();
serverInfoEmbed.setColor(0x00ffff);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),
	async execute(interaction) {
		// construct server info embed
		const serverInfo = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL())
			.setDescription("description of the server.")
			.addFields(
				{ name: "Some title", value: "Some Value" },
				{ name: "Inline title", value: "Inline value", inline: true }
			);

		await interaction.reply({ embeds: [serverInfo] });
	},
};