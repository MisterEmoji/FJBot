const productionAliases = ["prod", "production"];

// setup environment
const arg = process.argv[2];

if (productionAliases.includes(arg)) {
  process.env.NODE_ENV = "prod";
} else {
  process.env.NODE_ENV = "dev";
}
