// eslint-disable-next-line no-undef
module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['"Press Start 2p"'],
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
      },
      width: {
        gameboard: "4200px",
        goblinGameboard: "3200px",
      },
      animation: {
        float: "floating 3s ease-in-out infinite",
        pulsate: "pulsate 1s ease-in-out infinite",
      },
    },
    variants: {
      extend: {
        opacity: ["disabled"],
      },
    },
  },
};
