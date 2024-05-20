/*
This file handles command-line arguments
*/

// get first custom command-line argument
const firstArg = process.argv[2]?.toLowerCase();

module.exports = {
	// (expect 'public' (or 'pub') to indicate that we are running a public bot instance (not private))
	deployType:
		firstArg === "public" || firstArg === "pub" ? "public" : "private",
};
