const config = require("../local/config.json");
const { deployType } = require("./utils/arguments.js");

module.exports = {
	/**
	 * @description function resolves config fields to match selected (through cmd arguments) deployment type
	 * @returns {object} field values
	 */
	resolve() {
		if (deployType === "public") {
			return { ...config.global, ...config.public };
		} else {
			return { ...config.global, ...config.private };
		}
	},
};
