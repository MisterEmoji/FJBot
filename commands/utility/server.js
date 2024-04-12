const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),
	async execute(interaction) {
		async function getOwnerInfo() {
            try {
                const owner = await interaction.guild.fetchOwner();
                return owner.displayName;
            }
            catch (err) {
                throw new ReferenceError(err.message);
            }
        }

		async function getServerRoles() {
			try {
				const roleManager = await interaction.guild.roles.fetch();
				return roleManager.size;
			}
			catch (err) {
				throw new ReferenceError(err.message);
			};
		}
		const guildRoles = await getServerRoles() - 1;
        const ownerUsername = await getOwnerInfo();
		// construct server info embed
		const serverInfo = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL())
			.setImage(interaction.guild.bannerURL() ?? `https://i.imgur.com/mjPUk6r.png`)
			.addFields(
				{ name: "Users count:", value: interaction.guild.memberCount.toString(), inline: true},
				{ name: "Roles: ", value: guildRoles.toString(), inline: true },
				{ name: "Owner: ", value: ownerUsername, inline: true }
			);

		await interaction.reply({ embeds: [serverInfo] });
	},
};