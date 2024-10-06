const path = require("path");

const productionAliases = ["prod", "production"];

const arg = process.argv[2];

if (productionAliases.includes(arg)) {
  process.env.NODE_ENV = "prod";
} else {
  process.env.NODE_ENV = "dev";
}

global.projectdir = path.join(__dirname, "..");
global.appdir = path.join(__dirname, "../app");
