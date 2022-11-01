// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      body: ['"Paytone One"'],
      game: '"Sigmar One", cursive, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      // body: '"Paytone One", cursive, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    fontSize: {
      xxs: ["0.6875rem"],
      xs: ["0.75rem"],
      sm: ["0.875rem"],
      base: ["1rem"],
      lg: ["1.125rem"],
      xl: ["1.25rem"],
      "2xl": ["1.375rem"],
      "3xl": ["1.5rem"],
      "4xl": ["1.625rem"],
      "5xl": ["1.875rem"],
      "6xl": ["2rem"],
      "7xl": ["2.125rem"],
      "8xl": ["2.5rem"],
      "9xl": ["3rem"],
      "10xl": ["4rem"],
      "11xl": ["5rem"],
      "12xl": ["5.5rem"],
      "13xl": ["6rem"],
      "14xl": ["13.125rem"],
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    colors: {
      "overlay-white": "rgba(255, 255, 255, 0.5)",
      ...colors,
    },
    extend: {
      colors: {
        green: {
          background: "#63c74d",
        },
        blue: {
          300: "#0099da",
          600: "#0d87ff",
        },
        brown: {
          100: "#EAD4AA",
          200: "#e7a873",
          300: "#c28669",
          400: "#966953",
          600: "#b96f50",
          700: "#945542",
        },
        silver: {
          300: "#bfcbda",
        },
        error: "#e43b44",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      // This is the height and width of the gameboard
      // background image. Only change here when larger size is added.
      height: {
        gameboard: "4200px",
        goblinGameboard: "1600px",
        islandGameboard: "2400px",
        retreatGameboard: "2400px",
        snowKingdomGameboard: "2400px",
      },
      width: {
        gameboard: "4200px",
        goblinGameboard: "3200px",
        islandGameboard: "3200px",
        retreatGameboard: "3200px",
        snowKingdomGameboard: "3200px",
      },
      animation: {
        float: "floating 3s ease-in-out infinite",
        pulsate: "pulsate 1s ease-in-out infinite",
      },
      dropShadow: {
        highlight: [
          "1px 1px 0px white",
          "-1px 0px 0px white",
          "0px -1px 0px white",
        ],
      },
    },
  },
};
