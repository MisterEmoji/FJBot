const { request } = require("undici");
const { search: searchConfig } = require("../config-resolver.js").resolve();

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

// list of search interface languages
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

// supported search engines
const searchEngines = ["google", "brave"];

class WebSearcher {
	#searchEngine = "google";
	#interfaceLanguage = "en";

	/**
	 * @param {string} searchEngine
	 */
	set searchEngine(searchEngine) {
		if (searchEngines.includes(searchEngine)) {
			this.#searchEngine = searchEngine;
		}
	}

	/**
	 * @param {string} interfaceLanguage
	 */
	set interfaceLanguage(interfaceLanguage) {
		if (Array.from(iLanguages.values()).includes(interfaceLanguage)) {
			this.#interfaceLanguage = interfaceLanguage;
		}
	}

	get searchEngine() {
		return this.#searchEngine;
	}

	get interfaceLanguage() {
		return this.#interfaceLanguage;
	}

	constructor(interfaceLanguage = "en", searchEngine = searchEngines[0]) {
		this.#searchEngine = searchEngine;
		this.#interfaceLanguage = interfaceLanguage;
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
					hl: this.#interfaceLanguage,
					searchType: imageSearch ? "image" : "searchTypeUndefined",
					q: query,
					// maximum number of results to return in single page
					num: maxResults >= 10 ? 10 : maxResults,
				}).toString()
			);
		} else if (this.#searchEngine === "brave") {
			return imageSearch
				? BRAVE_IMG_ENDPOINT
				: BRAVE_WEB_ENDPOINT +
						new URLSearchParams({
							search_lang: this.#interfaceLanguage,
							q: query,
							text_decorations: 0,
							// maximum number of results to return in single page
							count: maxResults >= 20 ? 20 : maxResults,
						}).toString();
		}
	}

	#resolveSearchResponse(response) {
		if (this.#searchEngine === "google") {
			return {
				items: response.items.map((item) => {
					console.log(item.pagemap);
					return {
						title: item.title,
						link: item.link,
						brief: item.snippet,
						thumbnail: item.pagemap.cse_thumbnail?.[0] ??
							item.pagemap.cse_image?.[0] ?? {
								src: item.pagemap.metatags[0]?.["og:image"] ?? "",
							},
						image: item.image, // review this field
					};
				}),
			};
		} else if (this.#searchEngine === "brave") {
			return {
				items: response.web.results.map((item) => {
					return {
						title: item.title,
						link: item.url,
						brief: item.description,
						thumbnail:
							item.thumbnail ?? item.deep_results?.images?.[0].thumbnail ?? "",
						image: item.image, // review this field
					};
				}),
			};
		}
	}

	async search(query, maxResults, imageSearch) {
		let response;

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

		if (response.error) {
			let errorMessage;

			if (response.error.code === 429) {
				// Too many requests
				errorMessage = "Requests limit reached";
			} else {
				errorMessage = "Unknown error";
			}

			return { error: errorMessage };
		}
		return this.#resolveSearchResponse(response);
	}
}

module.exports = {
	interfaceLanguages: iLanguages,
	WebSearcher: WebSearcher,
};
