/* [[ KICK COMMAND MODULE]]

Authors: PomPon, MisterEmoji.
Desc: Kick command module, presenting detailed informations about server.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder, PermissionFlagsBits,
	ActionRowBuilder, ButtonBuilder,
	ButtonStyle,].
Export: CommandData & Execute.

*/

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
		.setDescription("Kick specified guild member.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Member of server to be kicked")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("Reason of the kick.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false), // Blocks ability to use command in bot direct messages channel
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
			content: `Are you sure you want to kick ${target} for reason: \`${reason}\`?`,
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
					content: "❌ Action cancelled",
					components: [],
				});
			}
		} catch (e) {
			console.log(e);
			await interaction.editReply({
				content: "⌛ Action execution failed: out of time",
				components: [],
			});
		}
	},
};
