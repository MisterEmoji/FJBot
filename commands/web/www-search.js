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
				.setDescription("Maximum number of returned results (from 1 to 10)")
				.setMinValue(1)
				.setMaxValue(10)
		)
		.addBooleanOption((option) =>
			option
				.setName("search-for-images")
				.setDescription("Search for information (false) or images (true)?")
		)
		.addBooleanOption((option) =>
			option
				.setName("image-as-attachment")
				.setDescription(
					"Display image as a link (false) or an attachment (true)?"
				)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const maxResults = interaction.options.getInteger("max-results") ?? 1;
		const searchForImages =
			interaction.options.getBoolean("search-for-images") ?? false;
		const asAttachment =
			interaction.options.getBoolean("as-attachment") ?? false;

		const url_path = `https://www.googleapis.com/customsearch/v1?
		key=${search_api_key}
		&cx=${search_engine_id}
		&q=${query}
		${searchForImages ? "&searchType=image" : ""}
		&num=${maxResults}`;

		const errorString = `Failed to search for \`${query}\`:\n`;

		await interaction.reply(`Searching for \`${query}\`...`);

		const parsedData = JSON.parse(await readFileFromURL(url_path));

		if (parsedData === null) {
			await interaction.editReply(errorString);
		} else {
			const files = [];

			let resultsNum = 0;
			// select first search result with proper extension and reply with it
			for (result of parsedData.items) {
				if (!mimeTypes.includes(result.mime)) continue;

				const ext = result.fileFormat.split("/")[1];

				files.push({
					attachment: result.link,
					name: `${query}${resultsNum}.${ext}`,
				});

				resultsNum++;
				if (resultsNum > maxResults) break;
			}

			interaction.editReply({
				content: `Search result for \`${query}\`:`,
				files: files,
			});
		}
	},
};
