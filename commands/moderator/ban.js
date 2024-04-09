const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Choose a member to ban.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Member to ban.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("description").setDescription("Description of the ban.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const desc =
			interaction.options.getString("description") ?? "no description";

		const confirm = new ButtonBuilder()
			.setCustomId("confirm")
			.setLabel("Confirm Ban")
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId("cancel")
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Are you sure you want to ban ${target} with description: ${desc}?`,
			components: [row],
		});

		// Filter below makes sure that only the user which fired the command can interact with buttons
		const collectorFilter = (i) => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({
				filter: collectorFilter,
				time: 60_000,
			});

			if (confirmation.customId === "confirm") {
				await interaction.guild.members
					.ban(target, { reason: desc })
					.then(() => {
						confirmation.update({
							content: `${target} has been banned with description: ${desc}`,
							components: [],
						});
					})
					.catch(() => {
						confirmation.update({
							content: `failed to ban ${target}`,
							components: [],
						});
					});
			} else if (confirmation.customId === "cancel") {
				await confirmation.update({
					content: "Action cancelled",
					components: [],
				});
			}
		} catch (e) {
			console.log(e);
			await interaction.editReply({
				content: "Confirmation not received within 1 minute, cancelling",
				components: [],
			});
		}
	},
};
