const config = require("../config/config.json");

module.exports =
process.env.NODE_ENV === "production"
  ? { ...config.global, ...config.production }
  : { ...config.global, ...config.development };
;