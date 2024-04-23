/* [[ PING COMMAND MODULE]]

Authors: MisterEmoji, PomPon.
Desc: Ping command module, printing out connection's latency.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder].
Export: CommandData & Execute.

*/
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply(`🏓 Pong!\nPing value: \`${Date.now() - interaction.createdTimestamp}ms\``);
	},
};
