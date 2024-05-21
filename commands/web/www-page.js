const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
	webSearch,
	interfaceLanguages: iLanguages,
} = require("../../core/utils/web-search");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("www-page")
		.setDescription("Search the Internet for websites!")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Query to search with.")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("max-results")
				.setDescription("Maximum number of returned results.")
				.setMinValue(1)
				.setMaxValue(10)
		)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription(
					"Set search interface language for more accurate results [Default: Polish]."
				)
				.setAutocomplete(true)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const lang = interaction.options.getString("language") ?? "pl";
		const maxResults = interaction.options.getInteger("max-results") ?? 1;

		// initially reply with discord-defined 'thinking' message
		await interaction.deferReply();

		const searchResult = await webSearch(query, lang, maxResults);

		const baseEmbed = new EmbedBuilder().setColor(0xff0000);

		const embeds = searchResult.items.map((item) => {
			return {
				...baseEmbed,
				title: item.title,
				url: item.link,
				thumbnail: { url: item.thumbnail.src ?? "" },
			};
		});

		embeds[embeds.length - 1].footer = {
			text: `requested by ${interaction.user.globalName}`,
		};
		embeds[embeds.length - 1].timestamp = new Date().toISOString();

		interaction.editReply({
			content: `search result(s) for \`${query}\`:`,
			embeds: embeds,
		});
	},
	async autocomplete(interaction) {
		let focusedValue = interaction.options.getFocused();
		if (focusedValue) {
			// capitalize first letter
			focusedValue =
				focusedValue.charAt(0).toUpperCase() + focusedValue.slice(1);
		}

		// filter choices
		const filteredKeys = [];
		for (const langKey of iLanguages.keys()) {
			if (langKey.startsWith(focusedValue)) {
				filteredKeys.push(langKey);
			}
			// 25 is maximum choices count for autocomplete
			if (filteredKeys.length === 25) break;
		}

		await interaction.respond(
			filteredKeys.map((choice) => ({
				name: choice,
				value: iLanguages.get(choice),
			}))
		);
	},
};
