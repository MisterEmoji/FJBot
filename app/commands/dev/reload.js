const { SlashCommandBuilder } = require("discord.js");
const { getPathOfCmd } = require("../../core/utils/commands");

// commands names cache for autocomplete
let commands = null;

/*
This commands is only capable of reloading execute function. In order to refresh data, you have to run deploy-cmds.js
*/
module.exports = {
  // make this command development bot instance only
  deployTarget: "dev",
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Command to reload.")
        .setAutocomplete(true)
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

    const commandPath = getPathOfCmd(commandName);

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
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    // get available command names
    if (commands === null) {
      await interaction.guild.commands.fetch().then((cmds) => {
        commands = cmds.map((cmd) => cmd.name);
      });
    }

    const filtered = commands.filter((choice) =>
      choice.startsWith(focusedValue)
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
