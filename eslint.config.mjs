import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

// override default config here
const overrides = {
  rules: {
    "no-unused-vars": "warn",
    "prefer-const": "warn",
  },
};

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  { ignores: ["*/node_modules/*"] },
  pluginJs.configs.recommended,
  overrides,
  eslintConfigPrettier,
];
