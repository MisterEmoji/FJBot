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
		.setName("search-web")
		.setDescription("Search the Internet!")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Query to search with.")
				.setRequired(true)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");

		const url_path = `https://www.googleapis.com/customsearch/v1?
		key=${search_api_key}&cx=${search_engine_id}&q=${query}
		&searchType=image`;

		const errorString = `Failed to search for \`${query}\``;

		await interaction.reply(`Searching for \`${query}\`...`);

		const parsedData = JSON.parse(await readFileFromURL(url_path));

		if (parsedData === null) {
			await interaction.editReply(errorString);
		} else {
			// select first search result with proper extension and reply with it
			for (result of parsedData.items) {
				if (!mimeTypes.includes(result.mime)) continue;

				const ext = result.fileFormat.split("/")[1];

				await interaction.editReply({
					content: `Search result for \`${query}\` query:`,
					files: [{ attachment: result.link, name: `${query}.${ext}` }],
				});
				break;
			}
		}
	},
};
