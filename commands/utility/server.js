const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Client } = require('discord.js');

let serverInfoEmbed = new EmbedBuilder()
serverInfoEmbed.setColor(0x00FFFF)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		serverInfoEmbed.setTitle(interaction.guild.name);
		serverInfoEmbed.addFields(
			{ name: 'Registered Users', value: `${interaction.guild.memberCount}`, inline: true },
			{ name: 'Qualified as large?', value: `${interaction.guild.large}`,  inline: true }
		)
		serverInfoEmbed.setThumbnail('https://i.imgur.com/cdyq23p.png');
		
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({embeds: [serverInfoEmbed]});
	},
}; 