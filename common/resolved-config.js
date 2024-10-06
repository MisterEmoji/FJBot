require("./envsetup");

const config = require("../config/config.json");

module.exports =
  process.env.NODE_ENV === "prod"
    ? { ...config.global, ...config.production }
    : { ...config.global, ...config.development };
