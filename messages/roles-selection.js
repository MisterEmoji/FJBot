const { RolesSelectComponentBuilder } = require("../modules/roles");
const { ActionRowBuilder } = require("discord.js");

module.exports = {
	/**
	 *
	 * @param {string} guildId
	 * @param {string} channelId
	 * @param {Map<string, string>} rolesIdsWithEmojis
	 * @param {string | undefined} text
	 */
	constructAndSend: async (
		botClient,
		guildId,
		channelId,
		rolesIdsWithEmojis,
		text
	) => {
		const allRoles = await (
			await botClient.guilds.fetch(guildId)
		).roles.fetch();
		const channel = await botClient.channels.fetch(channelId);

		const rolesToSelect = allRoles
			.filter((role) => rolesIdsWithEmojis.has(role.id))
			.map((role) => {
				return {
					role: { name: role.name, id: role.id },
					emoji: rolesIdsWithEmojis.get(role.id),
				};
			});

		const component = new ActionRowBuilder().addComponents(
			new RolesSelectComponentBuilder()
				.setMinValues(0)
				.setMaxValues(rolesToSelect.length)
				.addOptions(rolesToSelect)
		);

		channel.send({
			content: text ?? "Select a role(s)!",
			components: [component],
		});
	},

	execute: async (interaction) => {
		if (interaction.values.length > 0) {
			interaction.member.roles.add(
				interaction.values,
				"Roles added through the FJBot roles selection message"
			);
		}

		const rolesToDelete = interaction.component.options
			.filter((option) => {
				return (
					option.value !== interaction.guildId &&
					!interaction.values.includes(option.value) &&
					interaction.member.roles.cache.has(option.value)
				);
			})
			.map((option) => {
				return option.value;
			});

		if (rolesToDelete.length > 0) {
			interaction.member.roles.remove(
				rolesToDelete,
				"Roles removed through the FJBot roles selection message"
			);
		}

		await interaction.deferUpdate();
	},
};
