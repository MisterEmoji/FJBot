const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Select a member to kick")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("member to kick")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("kick reason")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const reason =
			interaction.options.getString("reason") ?? "no reason specified";

		const confirm = new ButtonBuilder()
			.setCustomId("confirm")
			.setLabel("Confirm kick")
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId("cancel")
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Are you sure you want to kick ${target} for reason: ${reason}?`,
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
					.kick(target, { reason: reason })
					.then(() => {
						confirmation.update({
							content: `${target} has been kicked`,
							components: [],
						});
					})
					.catch(() => {
						confirmation.update({
							content: `Failed to kick ${target}`,
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
