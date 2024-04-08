const { SlashCommandBuilder } = require("discord.js");
const { readFileFromURL } = require("../../utils.js");
const { search_api_key, search_engine_id } = require("../../config.json");

if (!search_api_key || !search_engine_id) {
	console.error(
		"[ERROR] missing search_api_key or search_engine_id in config.json"
	);
}

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
				.setDescription("Maximum number of returned results")
		)
		.addStringOption((option) =>
			option
				.setName("search-type")
				.setDescription("Search type [default: Page]")
				.addChoices(
					{ name: "Image", value: "image" },
					{ name: "Page", value: "page" }
				)
		)
		.addBooleanOption((option) =>
			option
				.setName("image-as-attachment")
				.setDescription(
					"Display image as a link (false) or an attachment (true)? May lag on higher max-results values"
				)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const searchForImages =
			(interaction.options.getString("search-type") ?? "page") === "page"
				? false
				: true;
		const asAttachment =
			interaction.options.getBoolean("image-as-attachment") ?? false;
		const maxResults = interaction.options.getInteger("max-results") ?? 3;

		// maximum numer of attachments is 10
		if (searchForImages && asAttachment && maxResults > 10) maxResults = 10;

		const errorString = `Failed to search for \`${query}\`:\n`;
		const urlPath = `https://www.googleapis.com/customsearch/v1?
		key=${search_api_key}
		&cx=${search_engine_id}
		&filter=1
		&q=${query}
		${searchForImages ? "&searchType=image" : ""}
		&num=${maxResults > 10 ? 10 : maxResults}`;

		await interaction.deferReply();

		const reply = {
			content: `Search result for \`${query}\`:`,
			files: [],
		};
		let urlAppend = "";

		for (let resultsNum = 0; resultsNum != maxResults; ) {
			let parsedData = JSON.parse(await readFileFromURL(urlPath + urlAppend));

			if (parsedData === null) {
				interaction.editReply(errorString);
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
							// break loop
							resultsNum = maxResults;
						} else {
							reply.content += str;
						}
					}

					if (resultsNum === maxResults) break;
				}

				// query next result page if needed
				if (resultsNum < maxResults) {
					const nextIndex = parsedData.queries.nextPage[0].startIndex;

					if (nextIndex) {
						urlAppend = `&start=${nextIndex}`;
					} else {
						break;
					}
				}
			}
		}

		interaction.editReply(reply);
	},
};