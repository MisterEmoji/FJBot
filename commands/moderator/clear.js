const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Deletes last count messages from text channel")
		.addIntegerOption((option) =>
			option
				.setName("count")
				.setDescription("Numer of messages to delete (1 - 100)")
				.setMinValue(1)
				.setMaxValue(100)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to delete messages from (current by default)")
				.addChannelTypes(ChannelType.GuildText)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false),
	async execute(interaction) {
		// TODO: fix this //

		const channel =
			interaction.options.getChannel("channel") ?? interaction.channel;
		const mCount = interaction.options.getInteger("count") ?? 60;

		const messages = await channel.bulkDelete(mCount).catch(console.error);

		await interaction.reply(
			`Deleted ${messages.size} messages from ${channel} channel`
		);
	},
};
