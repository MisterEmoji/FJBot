/*

[[ COIN-FLIP COMMAND MODULE]]

Authors: PomPon.
Desc: Coin-flip command module, tosses a coin and returns head or tail.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder].
Export: CommandData & Execute.

*/

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coin-flip")
		.setDescription("Tosses a coin!"),
	async execute(interaction) {
		await interaction.reply({
      ephemeral: true,
      content: Math.random() >= 0.5 ? "Heads!" : "Tails!",
    });
	},
};
