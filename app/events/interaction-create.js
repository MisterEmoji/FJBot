const { Events } = require("discord.js");

const { getCommandConfig } = require("../core/modulesInterface.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const cmdConfig = getCommandConfig(
        interaction.commandName,
        interaction.commandGuildId
      );

      if (cmdConfig.is_disabled) {
        console.error(
          `Command ${interaction.commandName} is disabled on this server.`
        );
        return;
      }

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        require("../modules/custom/commands.js")(interaction);
        // maybe later we will pass some more args thorugh command config here, so commands can be adjustable
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
    }
  },
};
