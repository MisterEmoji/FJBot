const { SlashCommandBuilder } = require("discord.js");
const { search_api_key, search_engine_id } = require("../../config.json");
const https = require("node:https");

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
		.setName("search-image")
		.setDescription("Search the Internet for images!")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Query to search the image with.")
				.setRequired(true)
		),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		// TODO: REWORK this so interactions can synchronize (do something with http.get (maybe make external function with fetches url and returns a promise?))
		// construct url path to google search api
		const url_path = `https://www.googleapis.com/customsearch/v1?
		key=${search_api_key}&cx=${search_engine_id}&q=${query}
		&searchType=image`;

		let parsedData;
		const errorString = `Failed to search for \`${query}\``;

		await interaction.reply(`Searching for \`${query}\`...`);

		https
			.get(url_path, (res) => {
				if (res.statusCode !== 200) {
					interaction.editReply(errorString);
					return;
				}

				let rawData = "";
				// sum every data entry...
				res.on("data", (chunk) => (rawData += chunk));

				// ... and then parse it
				res.on("end", () => {
					parsedData = JSON.parse(rawData);

					// select first search result with proper extension and reply with it
					for (result of parsedData.items) {
						if (!mimeTypes.includes(result.mime)) continue;

						const ext = result.fileFormat.split("/")[1];

						interaction.editReply({
							content: `Search result for \`${query}\` query:`,
							files: [{ attachment: result.link, name: `${query}.${ext}` }],
						});
						break;
					}
				});
			})
			.on("error", (e) => {
				console.error(e);
				interaction.editReply(errorString);
			});
	},
};
