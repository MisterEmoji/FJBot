const db = require("../../common/db.js");

module.exports = {
  disableCommad: async (guildId, commandName) => {
    await db.query(
      `INSERT INTO built_in_commads_overrides (guild_id, name, is_disabled) VALUES ($1, $2, true) ON CONFLICT (guild_id, name) DO UPDATE SET is_disabled = true;`,
      [guildId, commandName]
    );
  },
};
