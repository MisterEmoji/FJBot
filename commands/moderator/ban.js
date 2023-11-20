const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	Guild,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Select a member to ban")
		.addUserOption((option) =>
			option.setName("target").setDescription("member to ban").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("description").setDescription("description of ban")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const desc =
			interaction.options.getString("description") ?? "no description";

		await interaction.reply(`Banning ${target.username} for:\n${desc}`);
		await interaction.guild.members.ban(target);
	},
};
