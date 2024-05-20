const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { request } = require("undici");
const { apiKey, engineId } = require("../../core/config-resolver.js").resolve()
	.search;

if (!apiKey) {
	throw new ReferenceError("Missing 'search.apiKey' in confing.json");
}
if (!engineId) {
	throw new ReferenceError("Missing 'search.engineId' in confing.json");
}

// list of supported search interface languages
const iLanguages = new Map([
	["Afrikaans", "af"],
	["Albanian", "sq"],
	["Amharic", "sm"],
	["Arabic", "ar"],
	["Azerbaijani", "az"],
	["Basque", "eu"],
	["Belarusian", "be"],
	["Bengali", "bn"],
	["Bihari", "bh"],
	["Bosnian", "bs"],
	["Bulgarian", "bg"],
	["Catalan", "ca"],
	["Chinese (Simplified)", "zh-CN"],
	["Chinese (Traditional)", "zh-TW"],
	["Croatian", "hr"],
	["Czech", "cs"],
	["Danish", "da"],
	["Dutch", "nl"],
	["English", "en"],
	["Esperanto", "eo"],
	["Estonian", "et"],
	["Faroese", "fo"],
	["Finnish", "fi"],
	["French", "fr"],
	["Frisian", "fy"],
	["Galician", "gl"],
	["Georgian", "ka"],
	["German", "de"],
	["Greek", "el"],
	["Gujarati", "gu"],
	["Hebrew", "iw"],
	["Hindi", "hi"],
	["Hungarian", "hu"],
	["Icelandic", "is"],
	["Indonesian", "id"],
	["Interlingua", "ia"],
	["Irish", "ga"],
	["Italian", "it"],
	["Japanese", "ja"],
	["Javanese", "jw"],
	["Kannada", "kn"],
	["Korean", "ko"],
	["Latin", "la"],
	["Latvian", "lv"],
	["Lithuanian", "lt"],
	["Macedonian", "mk"],
	["Malay", "ms"],
	["Malayalam", "ml"],
	["Maltese", "mt"],
	["Marathi", "mr"],
	["Nepali", "ne"],
	["Norwegian", "no"],
	["Norwegian (Nynorsk)", "nn"],
	["Occitan", "oc"],
	["Persian", "fa"],
	["Polish", "pl"],
	["Portuguese (Brazil)", "pt-BR"],
	["Portuguese (Portugal)", "pt-PT"],
	["Punjabi", "pa"],
	["Romanian", "ro"],
	["Russian", "ru"],
	["Scots Gaelic", "gd"],
	["Serbian", "sr"],
	["Sinhalese", "si"],
	["Slovak", "sk"],
	["Slovenian", "sl"],
	["Spanish", "es"],
	["Sudanese", "su"],
	["Swahili", "sw"],
	["Swedish", "sv"],
	["Tagalog", "tl"],
	["Tamil", "ta"],
	["Telugu", "te"],
	["Thai", "th"],
	["Tigrinya", "ti"],
	["Turkish", "tr"],
	["Ukrainian", "uk"],
	["Urdu", "ur"],
	["Uzbek", "uz"],
	["Vietnamese", "vi"],
	["Welsh", "cy"],
	["Xhosa", "xh"],
	["Zulu", "zu"],
]);

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
				.setMaxValue(100)
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

		// construct custom search query url
		// documentation: https://developers.google.com/custom-search/v1
		/*
		key:   	  		API key
		cx:     	 		id of custom search engine to use
		hl:     	 		specifies interface language to use (improves performance)
		q:       			query
		searchType: 	the only valid value is 'image'
		num:					maximum number of results to return in single page
		start: 				index of the result to show as the first in page
		   						(maximum number of returned results is 100 (API restriction))
		*/
		const urlPath = `https://www.googleapis.com/customsearch/v1?
		key=${apiKey}
		&cx=${engineId}
		&hl=${lang}
		&q=${query}`;

		// initially reply with discord-defined 'thinking' message
		await interaction.deferReply();

		let urlAppend = "";
		let resultsNum = 0;

		const fields = [];

		// add results to reply until we fetch enough of them
		// or there are no more results
		while (resultsNum !== maxResults) {
			let parsedData = await (await request(urlPath + urlAppend)).body.json();

			if (parsedData.error) {
				throw new Error(parsedData.error.message);
			} else {
				console.log(parsedData);
				// select next search results
				for (result of parsedData.items) {
					fields.push({ value: result.link });
				}

				if (resultsNum === maxResults) break;

				// query next result page if needed
				if (resultsNum < maxResults) {
					const nextIndex = parsedData.queries.nextPage[0].startIndex;

					if (nextIndex) {
						urlAppend = `&start=${nextIndex}`;
					} else {
						// break, no more results found
						break;
					}
				}
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle(`Search results for \`${query}\``)
			.addFields(fields);

		interaction.editReply({ embeds: [embed] });
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
