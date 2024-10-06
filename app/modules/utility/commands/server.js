/*

[[ SERVER COMMAND MODULE]]

Authors: MisterEmoji, PomPon.
Desc: Server command module, presenting detailed informations about server.
Required modules: None.
External dependencies: Discord.JS [SlashCommandBuilder, EmbedBuilder].
Export: CommandData & Execute.

*/

const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.")
    .setContexts([InteractionContextType.Guild]),
  async execute(interaction) {
    // Server owner's username fetching
    async function getOwnerInfo() {
      try {
        const owner = await interaction.guild.fetchOwner();
        return owner.displayName;
      } catch (err) {
        throw new ReferenceError(err.message);
      }
    }
    // Server's role fetching
    async function getServerRoles() {
      try {
        const roleManager = await interaction.guild.roles.fetch();
        return roleManager.size;
      } catch (err) {
        throw new ReferenceError(err.message);
      }
    }
    const guildRoles = (await getServerRoles()) - 1;
    const ownerUsername = await getOwnerInfo();
    // Contructor of Embed containing all server info
    const serverInfo = new EmbedBuilder()
      .setColor(0xffffff) // Embed side-bar color
      .setTitle(interaction.guild.name) // Header Title
      .setThumbnail(
        interaction.guild.iconURL() ?? `https://i.imgur.com/mjPUk6r.png`
      ) // Small corner image
      .setImage(
        interaction.guild.bannerURL() ?? `https://i.imgur.com/mjPUk6r.png`
      ) // Big image
      .addFields(
        {
          name: "Users count:",
          value: interaction.guild.memberCount.toString(),
          inline: true,
        },
        {
          name: "Amount of roles: ",
          value: guildRoles.toString(),
          inline: true,
        },
        { name: "Owner: ", value: ownerUsername, inline: true }
      );

    await interaction.reply({ embeds: [serverInfo] });
  },
};
