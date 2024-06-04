const { Events } = require("discord.js");

const { RolesSelectComponentCustomId } = require("../modules/roles");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}\n`);
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: `There was an error while executing this command! \n \`${error}\``,
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: `There was an error while executing this command! \n \`${error}\``,
						ephemeral: true,
					});
				}
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === RolesSelectComponentCustomId) {
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
			}
		}
	},
};
