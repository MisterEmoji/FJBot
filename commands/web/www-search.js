const { SlashCommandBuilder } = require("discord.js");
const { requestBody } = require("../../core/utils.js");
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

// supported image mime types
const mimeTypes = [
	"image/apng",
	"image/bmp",
	"image/png",
	"image/webp",
	"image/avif",
	"image/gif",
	"image/jpeg",
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("www-search")
		.setDescription("Search the Internet!")
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
		)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("Set search interface language [Default: Polish].")
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName("search-type")
				.setDescription("Search type [default: Page].")
				.addChoices(
					{ name: "Image", value: "image" },
					{ name: "Page", value: "page" }
				)
		)
		.addBooleanOption((option) =>
			option
				.setName("image-as-attachment")
				.setDescription(
					"Display image as a link (false) or an attachment (true)? May lag on higher --max-results-- values."
				)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const searchForImages =
			(interaction.options.getString("search-type") ?? "page") === "page"
				? false
				: true;
		const lang = interaction.options.getString("language") ?? "pl";
		const asAttachment =
			interaction.options.getBoolean("image-as-attachment") ?? false;
		const maxResults = interaction.options.getInteger("max-results") ?? 3;

		// maximum numer of attachments is 10
		if (searchForImages && asAttachment && maxResults > 10) maxResults = 10;

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
		&q=${query}
		${searchForImages ? "&searchType=image" : ""}
		&num=${maxResults > 10 ? 10 : maxResults}`;

		// initially reply with discord-defined 'thinking' message
		await interaction.deferReply();

		let urlAppend = "";
		let sizeOverflow = false;
		let resultsNum = 0;
		const reply = {
			content: `Search results for \`${query}\`:`,
			files: [],
		};

		// add results to reply until we fetch enough of them
		// or there are no more results
		while (resultsNum !== maxResults && !sizeOverflow) {
			let parsedData = JSON.parse(await requestBody(urlPath + urlAppend));

			if (parsedData === null) {
				interaction.editReply(`Failed to search for \`${query}\`:\n`);
				return;
			} else {
				// select next search results with proper extensions
				for (result of parsedData.items) {
					if (asAttachment && searchForImages) {
						if (!mimeTypes.includes(result.mime)) continue;

						const ext = result.fileFormat.split("/")[1];

						reply.files.push({
							attachment: result.link,
							name: `${query}${++resultsNum}.${ext}`,
						});
					} else {
						const str = `\n${++resultsNum}. ${result.link}`;

						// reply.content cannot exceed 2000 string length
						if (str.length + reply.content.length > 2000) {
							// escape from loops
							sizeOverflow = true;
							break;
						} else {
							reply.content += str;
						}
					}

					if (resultsNum === maxResults) break;
				}

				// query next result page if needed
				if (resultsNum < maxResults && !sizeOverflow) {
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

		interaction.editReply(reply);
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