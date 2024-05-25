const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

const { search: searchConfig } =
	require("../core/config-resolver.js").resolve();

if (!searchConfig.google.apiKey) {
	throw new ReferenceError("Missing 'search.google.apiKey' in config.json");
}
if (!searchConfig.google.engineId) {
	throw new ReferenceError("Missing 'search.google.engineId' in config.json");
}
if (!searchConfig.brave.apiKey) {
	throw new ReferenceError("Missing 'search.brave.apiKey' in config.json");
}

const GOOGLE_ENDPOINT = "https://www.googleapis.com/customsearch/v1?";
const BRAVE_WEB_ENDPOINT = "https://api.search.brave.com/res/v1/web/search?";
const BRAVE_IMG_ENDPOINT = "https://api.search.brave.com/res/v1/images/search?";

const DEFAULT_MAX_RESULTS = 10;

// supported search engines
const searchEngines = ["google", "brave"];

class WebSearcher {
	#searchEngine = "google";
	#SEIndex = 0;

	/**
	 * @param {string} searchEngine
	 */
	set searchEngine(searchEngine) {
		if (searchEngines.includes(searchEngine)) {
			this.#searchEngine = searchEngine;
			this.#SEIndex = searchEngine.indexOf(searchEngine);
		}
	}

	get searchEngine() {
		return this.#searchEngine;
	}

	constructor(searchEngine = searchEngines[0]) {
		this.#searchEngine = searchEngine;
	}

	#buildRequestHeaders() {
		if (this.#searchEngine === "brave") {
			return {
				"X-Subscription-Token": searchConfig.brave.apiKey,
			};
		}
	}

	#buildRequestURL(query, maxResults, imageSearch = false) {
		if (this.#searchEngine === "google") {
			return (
				GOOGLE_ENDPOINT +
				new URLSearchParams({
					key: searchConfig.google.apiKey,
					cx: searchConfig.google.engineId,
					searchType: imageSearch ? "image" : "searchTypeUndefined",
					fileType: imageSearch ? "jpg" : "",
					q: query,
					// maximum number of results to return in single page
					num: maxResults >= 10 ? 10 : maxResults,
				}).toString()
			);
		} else if (this.#searchEngine === "brave") {
			const params = new URLSearchParams({
				q: query,
				// maximum number of results to return in single page
				count: maxResults >= 20 ? 20 : maxResults,
			});

			if (imageSearch) {
				return BRAVE_IMG_ENDPOINT + params.toString();
			} else {
				params.set("text_decorations", "0");
				return BRAVE_WEB_ENDPOINT + params.toString();
			}
		}
	}

	#resolveSearchResponse(response, imageSearch = false, searchInfo = {}) {
		let items;

		if (!imageSearch) {
			switch (this.#searchEngine) {
				case "google":
					items = response.items.map((item) => {
						return {
							title: item.title,
							link: item.link,
							brief: item.snippet,
							thumbnail: item.pagemap.cse_thumbnail?.[0] ??
								item.pagemap.cse_image?.[0] ?? {
									src: item.pagemap.metatags[0]?.["og:image"] ?? "",
								},
						};
					});
					break;

				case "brave":
					items = response.web.results.map((item) => {
						return {
							title: item.title,
							link: item.url,
							brief: item.description,
							thumbnail:
								item.thumbnail ??
								item.deep_results?.images?.[0].thumbnail ??
								"",
						};
					});
					break;

				default:
					break;
			}
		} else {
			switch (this.#searchEngine) {
				case "google":
					items = response.items.map((item) => {
						return {
							link: item.link,
						};
					});
					break;

				case "brave":
					items = response.results.map((item) => {
						return {
							link: item.properties.url,
						};
					});
					break;

				default:
					break;
			}
		}
		return {
			meta: {
				...searchInfo,
				searchEngine: this.#searchEngine,
			},
			items: items,
		};
	}

	async search(query, maxResults, imageSearch = false, forceOnce = false) {
		let response;
		const measureStart = Date.now();

		try {
			response = await (
				await request(this.#buildRequestURL(query, maxResults, imageSearch), {
					headers: this.#buildRequestHeaders(),
				})
			).body.json();
		} catch (err) {
			console.error(err);
			return {
				error: `failed to request ${this.#searchEngine} api endpoint`,
			};
		}

		// TODO: remake this error system to make better error messages, maybe expose original error object to the user in some cases

		if (response.error) {
			console.error(response.error);

			if (!forceOnce && this.#SEIndex + 1 < searchEngines.length) {
				// try next search engine if allowed and there is another one
				this.#searchEngine = searchEngines[++this.#SEIndex];
				return this.search(query, maxResults, imageSearch);
			}

			let errorMessage;

			// TODO: use response.error.status on brave se tro access status code

			if (response.error.code === 429) {
				// Too many requests
				errorMessage = "Requests limit reached";
			} else {
				errorMessage = "Unknown error";
			}

			return { error: errorMessage };
		}

		const measureEnd = Date.now();

		return this.#resolveSearchResponse(response, imageSearch, {
			searchTime: measureEnd - measureStart,
			query: query,
		});
	}
}

class WebSearchCommandBuilder {
	#searchErrorMessage = (err) => {
		return "Failed to search due to: " + err;
	};

	#replyBuilder = (searchRes) => {
		return {
			content: "Successfull search",
		};
	};

	#imageSearch = false;

	data = new SlashCommandBuilder();

	constructor(imageSearch = false, maxResults = DEFAULT_MAX_RESULTS) {
		this.#imageSearch = imageSearch;
		this.data
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
					.setMaxValue(maxResults ?? DEFAULT_MAX_RESULTS)
			)
			.addStringOption((option) =>
				option
					.setName("search-engine")
					.setDescription("Set preferred search engine to search with.")
					// TODO: try to make this choices dynamic,
					// so any change in searchEngines array wil be reflected here.
					.addChoices(
						{
							name: "Google",
							value: "google",
						},
						{
							name: "Brave",
							value: "brave",
						}
					)
			);
	}

	execute = async (interaction) => {
		const query = interaction.options.getString("query");
		const se =
			interaction.options.getString("search-engine") ?? searchEngines[0];
		const maxResults = interaction.options.getInteger("max-results") ?? 1;

		// initially reply with discord-defined 'thinking' message
		await interaction.deferReply();

		const searcher = new WebSearcher(se);

		const searchResult = await searcher.search(
			query,
			maxResults,
			this.#imageSearch
		);

		if (searchResult.error) {
			// FIX: ephemeral doesn't work here
			// (probably because the first message has to be ephemeral)
			interaction.followUp({
				content: this.#searchErrorMessage(searchResult.error),
				ephemeral: true,
			});
			return;
		}

		interaction.editReply(this.#replyBuilder(searchResult));
	};

	/**
	 *
	 * @param {(data: SlashCommandBuilder) => void} callback
	 */
	modifyData(callback) {
		callback(this.data);
		return this;
	}

	/**
	 * There is no need to handle errors here.
	 * @param {(searchResult) => object} callback
	 */
	replyBuilder(callback) {
		this.#replyBuilder = callback;
		return this;
	}

	/**
	 *
	 * @param {(error: object) => string} callback
	 */
	setSearchErrorMessage(callback) {
		this.#searchErrorMessage = callback;
		return this;
	}

	setName(name) {
		this.data.setName(name);
		return this;
	}

	setDescription(description) {
		this.data.setDescription(description);
		return this;
	}
}

module.exports = {
	WebSearcher: WebSearcher,
	WebSearchCommandBuilder: WebSearchCommandBuilder,
};
