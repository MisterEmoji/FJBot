const db = require("../../../common/db");

async function resolve(guildId) {
  const module_config = db.fetchSingle(
    await db.query(
      `SELECT module_config_id, is_disabled FROM app_modules_config WHERE module_name = 'moderator' AND guild_id = $1`,
      [BigInt(guildId)]
    )
  );

  const commands = [];

  console.log(module_config);

  if (!module_config.is_disabled) {
    const commands_config = db.fetchAll(
      await db.query(
        `SELECT command_name, is_disabled FROM app_commands_config WHERE module_config_id = $1`,
        [module_config.module_config_id]
      )
    );

    console.log(commands_config);
  }

  return {
    isDisabled: module_config.is_disabled,
    commands: commands,
  };
}
resolve("1174001410833129573");

module.exports = resolve;
