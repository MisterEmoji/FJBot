const { WebSearchCommandBuilder } = require("../../modules/web");

module.exports = new WebSearchCommandBuilder()
	.setName("web-page")
	.setDescription("Search the Internet for websites!")
	.replyBuilder((searchResult) => {
		const baseEmbedProps = {
			color: 0x0000ff,
		};

		const embeds = searchResult.items.map((item) => {
			return {
				...baseEmbedProps,
				title: item.title,
				url: item.link,
				description: item.brief,
				thumbnail: { url: item.thumbnail.src ?? "" },
			};
		});

		embeds[embeds.length - 1].footer = {
			text: `search time: ${searchResult.meta.searchTime}ms  •  engine: ${searchResult.meta.searchEngine}`,
		};
		embeds[embeds.length - 1].timestamp = new Date().toISOString();

		return {
			content: `search result(s) for \`${searchResult.meta.query}\`:`,
			embeds: embeds,
		};
	});
