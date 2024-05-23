/*

[[ USER COMMAND MODULE]]

Authors: MisterEmoji, PomPon.
Desc: Server command module, presenting detailed informations about server.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder, EmbedBuilder].
Export: CommandData & Execute.

*/


const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Provides information about the user.")
		.addUserOption((option) =>
			option.setName("target").setDescription("User to display info about.")
		)
		.setDMPermission(false),
	async execute(interaction) {
		const target = interaction.options.getUser("target") ?? interaction.user;
		const member = await interaction.guild.members.fetch(target.id);

		// Provided user's informations
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
