require("./common/env.js");

const db = require("./common/db.js");

// capture process interrupt signal (e.g. ctrl+c) to perform gracefull cleanup
process.on("SIGINT", () => {
  console.log("[LOG] Shutting down");

  db.end();

  process.exit();
});

require("./backend/app.js");
require("./app/core/index.js");
