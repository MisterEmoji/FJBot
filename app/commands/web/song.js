/*
	WIP
*/

const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");
const { apiKey } = require("../../../common/config-resolver.js").resolve()
  .search;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("song")
    .setDescription("Play a song.")
    .addStringOption((option) =>
      option.setName("query").setDescription("Query to search the song with.")
    )
    .addAttachmentOption((option) =>
      option
        .setName("file-path")
        .setDescription("Optional path to the audio file on the disk.")
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const audioFile = interaction.options.getAttachment("file-path");

    if (query) {
      let urlPath = `https://www.googleapis.com/youtube/v3/search?
			key=${apiKey}
      &part=snippet
      &q=${query}
			$maxResults=1
      &type=video`;

      const reqResult = (await (await request(urlPath)).body.json()).items[0];

      urlPath = `https://www.googleapis.com/youtube/v3/videos?
			id=${reqResult.id.videoId}
			&key=${apiKey}
			&part=snippet%2CcontentDetails`;

      const videoInfo = await (await request(urlPath)).body.json();
      console.log(JSON.stringify(videoInfo, null, 2));
    } else if (audioFile) {
      console.log("audio file");
    } else {
      interaction.reply("No query or file path specified.");
    }
  },
};
