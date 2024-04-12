const config = require("../local/config.json");
const { deployType } = require("./cmd-args.js");

module.exports = {
	/**
	 * @description function resolves config fields to match selected (through cmd argument) deployment configuration/type
	 * @returns {object} fields value
	 */
	resolve() {
		if (deployType === "public") {
			return { ...config.global, ...config.public };
		} else {
			return { ...config.global, ...config.private };
		}
	},
};
