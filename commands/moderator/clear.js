/*

[[ CLEAR COMMAND MODULE]]

Authors: PomPon, MisterEmoji.
Desc: Clear command module, deletes given amount of messages from last two weeks.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder, ChannelType,
	PermissionFlagsBits].
Export: CommandData & Execute.

*/

const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Deletes given amount of messages from last two weeks.")
		.addIntegerOption((option) =>
			option
				.setName("count")
				.setDescription("Number of messages to delete.")
				.setMaxValue(100)
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to delete messages from (current by default).")
				.addChannelTypes(ChannelType.GuildText)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false),
	async execute(interaction) {
		const channel =
			interaction.options.getChannel("channel") ?? interaction.channel;
		const count =
			interaction.options.getInteger("count") ?? Number.MAX_SAFE_INTEGER;

		const messages = await channel.bulkDelete(count);

		await interaction.reply(
			`Deleted \`${messages.size}\` messages from ${channel} channel.`,
			{ ephemeral: true }
		);
	},
};
