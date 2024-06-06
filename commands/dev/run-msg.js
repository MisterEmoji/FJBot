const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	deployTarget: "private",
	data: new SlashCommandBuilder()
		.setName("run-msg")
		.setDescription("Runs selected test bot message.")
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("Message to run.")
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option.setName("channel").setDescription("Channel to send message to.")
		)
		.setDMPermission(false),
	async execute(interaction) {
		const msg = interaction.options.getString("message");
		const ch = interaction.options.getChannel("channel") ?? interaction.channel;
		const client = require("../../modules/client");
		console.log(ch);
		try {
			const msgModule = require(`../../messages/${msg}.js`);
			msgModule.constructAndSend(
				client,
				interaction.guildId,
				ch,
				new Map([
					["1177693023455416490", "🎩"],
					["1231009480083378248", "😀"],
				])
			);

			await interaction.reply(
				`Succesfuly ran selected message on ${ch} channel!`
			);
		} catch (err) {
			await interaction.reply(
				`Failed to run this message with error:\n\`${err}\``
			);
		}
	},
};
