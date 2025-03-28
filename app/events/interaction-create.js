const { Events } = require("discord.js");

const { RolesSelectComponentCustomId } = require("../modules/roles");
const rolesSelectionMessage = require("../messages/roles-selection.js");

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
				console.error(`Error executing ${interaction.commandName}\n`, error);
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
				try {
					rolesSelectionMessage.execute(interaction);
				} catch (error) {
					console.error(`Error executing roles select component:\n`, error);
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({
							content: `There was an error while handling roles select component! \n \`${error}\``,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `There was an error while handling roles select component! \n \`${error}\``,
							ephemeral: true,
						});
					}
				}
			}
		}
	},
};
