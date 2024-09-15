const config = require("../config/config.json");

module.exports = {
  /**
   * @description function resolves config fields to match selected (through cmd arguments) deployment type
   * @returns {object} field values
   */
  resolve() {
    if (process.env.NODE_ENV === "production") {
      return { ...config.global, ...config.production };
    } else {
      return { ...config.global, ...config.development };
    }
  },
};
