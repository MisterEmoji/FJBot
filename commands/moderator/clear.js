/* 

[[ BAN COMMAND MODULE]]

Authors: PomPon, MisterEmoji.
Desc: Clear command module, deleting given amount of commands from last two weeks.
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
		.setDescription("Deletes last --count-- messages from the text channel.")
		.addIntegerOption((option) =>
			option
				.setName("count")
				.setDescription(
					"Numer of messages to delete. Omit to delete all messages."
				)
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
		// TODO: fix this //
		const channel =
			interaction.options.getChannel("channel") ?? interaction.channel;
		const mCount =
			interaction.options.getInteger("count") ?? Number.MAX_SAFE_INTEGER;

		console.log(channel.messages.holds);
		const messages = await channel.messages.fetch({
			cache: false,
			force: true,
		});
		const deletedMessages = messages.size;
		channel.bulkDelete(messages);

		await interaction.reply(
			`Deleted ${deletedMessages} messages from ${channel} channel`,
			{ ephemeral: true }
		);
	},
};
