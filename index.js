require("./common/envsetup.js");

const db = require("./common/db.js");

db.start();

// capture process interrupt signal (e.g. ctrl+c) to perform gracefull cleanup
process.on("SIGINT", () => {
  console.log("[LOG] Shutting down");

  db.end();

  process.exit();
});

require("./backend/app.js");
require("./app/app.js");
