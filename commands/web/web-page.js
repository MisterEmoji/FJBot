const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
	interfaceLanguages: iLanguages,
	WebSearcher,
} = require("../../core/utils/web-search");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("web-page")
		.setDescription("Search the Internet for websites!")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Query to search with.")
				.setRequired(true)
				.setMaxLength(400)
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
		)
		.addStringOption((option) =>
			option
				.setName("search-engine")
				.setDescription("Set search engine to search with.")
				.addChoices(
					{ name: "Google", value: "google" },
					{ name: "Brave", value: "brave" }
				)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const lang = interaction.options.getString("language") ?? "pl";
		const se = interaction.options.getString("search-engine") ?? "google";
		const maxResults = interaction.options.getInteger("max-results") ?? 1;

		// initially reply with discord-defined 'thinking' message
		await interaction.deferReply();

		const searcher = new WebSearcher(lang, se);

		const measureStart = Date.now();

		const searchResult = await searcher.search(query, maxResults);

		const measureEnd = Date.now();

		if (searchResult.error) {
			interaction.followUp({
				content: "Failed to search due to:\n" + searchResult.error,
				ephemeral: true,
			});
			return;
		}

		const baseEmbed = new EmbedBuilder().setColor(0xff0000);

		const embeds = searchResult.items.map((item) => {
			return {
				...baseEmbed,
				title: item.title,
				url: item.link,
				description: item.brief,
				thumbnail: { url: item.thumbnail.src ?? "" },
			};
		});

		embeds[embeds.length - 1].footer = {
			text: `Search time: ${
				measureEnd - measureStart
			}ms  •  Search engine: ${se}`,
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
