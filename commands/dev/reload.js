const { SlashCommandBuilder } = require("discord.js");
const getPathOf = require("../../utils.js");
/*
This commands is only capable of reloading execute function. In order to refresh data, you have to run deploy-cmds.js
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads a command.")
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("Command to reload.")
				.setRequired(true)
		),
	async execute(interaction) {
		const commandName = interaction.options.getString("command").toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(
				`There is no command with name \`${commandName}\`!`
			);
		}

		const commandPath = getPathOf(commandName);

		delete require.cache[require.resolve(commandPath)];

		try {
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(commandPath);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`
			);
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
			);
		}
	},
};
