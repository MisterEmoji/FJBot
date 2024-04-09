const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Timeout a member for a given time.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Member to timeout.")
				.setRequired(true)
		)
		.addNumberOption((option) =>
			option
				.setName("time")
				.setDescription(
					"Duration of timeout in minutes. Omit to remove the timeout."
				)
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("Reason of the timeout.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const target = interaction.options.getMember("target");
		const time = interaction.options.getNumber("time");
		const reason = interaction.options.getString("reason");

		await target
			.timeout(time, reason)
			.then(() => {
				interaction.reply(`${target} has been timeouted for ${time} minutes`);
			})
			.catch(() => {
				interaction.reply(`failed to timeout ${target}`);
			});
	},
};