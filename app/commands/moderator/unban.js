const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Choose a member to unban.")
		.addStringOption((option) =>
			option
				.setName("target")
				.setDescription("The username of member to unban.")
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option.setName("description").setDescription("Description of unban.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const targetName = interaction.options.getString("target");
		// get user object based on username
		const targetUser = interaction.client.users.cache.find(
			(user) => user.username == targetName
		);
		const desc =
			interaction.options.getString("description") ?? "no description";

		if (targetUser) {
			await interaction.guild.members.unban(targetUser, { reason: desc });
			await interaction.reply(
				`Successfully unbaned ${targetUser} with description : ${desc}`
			);
		} else {
			await interaction.reply(`Failed to unban user with name: ${targetName}`);
		}
	},
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		// get usernames of banned users
		let choices = [];
		await interaction.guild.bans.fetch().then((bans) => {
			choices = bans.map((ban) => ban.user.username);
		});

		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue)
		);

		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		);
	},
};
