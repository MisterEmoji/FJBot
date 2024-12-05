const { EmbedBuilder } = require("discord.js");
const { WebSearchCommandBuilder } = require("../web");

module.exports = new WebSearchCommandBuilder(true)
  .setName("web-image")
  .setDescription("Search the Internet for images!")
  .replyBuilder((searchResult) => {
    const footerEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setFooter({
        text: `search time: ${searchResult.meta.searchTime}ms  •  engine: ${searchResult.meta.searchEngine}`,
      })
      .setTimestamp();

    return {
      content: `image(s) matching \`${searchResult.meta.query}\`:`,
      files: searchResult.items.map((item) => {
        return item.link;
      }),
      embeds: [footerEmbed],
    };
  });
