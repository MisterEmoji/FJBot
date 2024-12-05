/*

[[ BAN COMMAND MODULE]]

Authors: PomPon, MisterEmoji.
Desc: Ban command module, operating on discord ban function.
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
  InteractionContextType,
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
      option.setName("reason").setDescription("Reason of the ban.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts([InteractionContextType.Guild]),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const desc =
      interaction.options.getString("description") ?? "no description";

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger);

    // Cancel button
    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

    const response = await interaction.reply({
      content: `Are you sure you want to ban ${target} for following reason: ${desc}?`,
      components: [row],
      ephemeral: true,
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
              content: `${target} has been banned for following reason: ${desc}`,
              components: [],
            });
          })
          .catch(() => {
            confirmation.update({
              content: `Failed to ban ${target}`,
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
        content: "Action cancelled: not confirmed",
        components: [],
      });
    }
  },
};
