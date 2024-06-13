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

		let msgModule;

		try {
			msgModule = require(`../../messages/${msg}.js`);
		} catch (err) {
			await interaction.reply({
				content: `Error: There is no message with name \`${msg}\``,
				ephemeral: true,
			});
		}

		msgModule.constructAndSend(
			client,
			interaction.guildId,
			ch,
			new Map([
				["1177693023455416490", "🎩"],
				["1231009480083378248", "😀"],
			])
		);

		await interaction.reply({
			content: `Succesfuly ran selected message on ${ch} channel!`,
			ephemeral: true,
		});

	},
};
