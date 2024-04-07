const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Provides information about the user.")
		.addUserOption((option) =>
			option.setName("target").setDescription("User to display info about")
		),
	async execute(interaction) {
		const target = interaction.options.getUser("target") ?? interaction.user;
		const member = await interaction.guild.members.fetch(target.id);

		await interaction.reply(
			`${target}:
			-> his UserId is: \`${target.id}\`
			-> joined ${interaction.guild} at ${member.joinedAt.toDateString()}
			-> created account at ${target.createdAt.toDateString()}
			-> ${target.bot ? "is a bot" : "isn't a bot"}
			-> ${
				member.permissions.has(PermissionFlagsBits.Administrator)
					? "has administrator permissions"
					: "has no administrator permissions"
			}`
		);
	},
};
