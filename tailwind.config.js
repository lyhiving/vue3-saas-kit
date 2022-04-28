const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.vue", "./src/**/*.js", "./src/**/*.ts", "./src/**/*.jsx", "./src/**/*.tsx", "./src/**/*.html", "./src/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        indigo: colors.indigo,
        blue: colors.blue,
        red: colors.red,
        orange: colors.orange,
        yellow: colors.yellow,
        green: colors.green,
        teal: colors.teal,
        purple: colors.purple,
        pink: colors.pink,
        slate: colors.slate,
        gray: colors.gray,
        neutral: colors.neutral,
        stone: colors.stone,
        amber: colors.amber,
        lime: colors.lime,
        emerald: colors.emerald,
        cyan: colors.cyan,
        sky: colors.sky,
        violet: colors.violet,
        fuchsia: colors.fuchsia,
        rose: colors.rose,
        theme: {
          50: colors.teal[50],
          100: colors.teal[100],
          200: colors.teal[200],
          300: colors.teal[300],
          400: colors.teal[400],
          500: colors.teal[500],
          600: colors.teal[600],
          700: colors.teal[700],
          800: colors.teal[800],
          900: colors.teal[900],
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
