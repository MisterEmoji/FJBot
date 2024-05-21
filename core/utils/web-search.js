const { request } = require("undici");
const { apiKey, engineId } = require("../config-resolver.js").resolve().search;

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
	interfaceLanguages: iLanguages,
	async webSearch(query, interfaceLang, resultsNum) {
		// construct google custom search query url
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
		&hl=${interfaceLang}
		&q=${query}
    ${resultsNum <= 10 && resultsNum > 0 ? `&num=${resultsNum}` : ""}`;

		const response = await (await request(urlPath)).body.json();

		const reqObject = response.queries.request[0];
		return {
			meta: {
				totalResults: reqObject.totalResults,
				language: reqObject.language,
				searchType: reqObject.searchType,
			},
			items: response.items.map((item) => {
				console.log(item.pagemap);
				return {
					title: item.title,
					link: item.link,
					thumbnail: item.pagemap.cse_thumbnail
						? item.pagemap.cse_thumbnail[0]
						: {
								src: item.pagemap.metatags["og:image"],
						  },
					image: item.image,
				};
			}),
		};
	},
};
