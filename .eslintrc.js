const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "eslint/rules";

module.exports = {
  root: true,
  ignorePatterns: ["dist", "coverage"],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  plugins: ["rulesdir", "vue"],
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended", "plugin:@intlify/vue-i18n/recommended"],
  rules: {
    "vue/no-unused-components": "off",
    "rulesdir/no-unused-components": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-undef": 0,
    "no-useless-escape": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@intlify/vue-i18n/no-dynamic-keys": 0,
    "@intlify/vue-i18n/no-unused-keys": [
      "warn",
      {
        extensions: [".js", ".vue"],
      },
    ],
    "@intlify/vue-i18n/no-raw-text": [
      "warn",
      {
        ignorePattern: "^[-#:()&|./?,$-%0123456789👋!@-]+$",
      },
    ],
  },
  settings: {
    "vue-i18n": {
      localeDir: "./src/locale/*.{json}",
    },
  },
};
