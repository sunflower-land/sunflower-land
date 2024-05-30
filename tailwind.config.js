// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      body: ['"Basic","ZCOOL KuaiLe"'],
      secondary: ["Hint"],
      error: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
      speech: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
    },
    fontSize: {
      xxs: [
        "0.6rem",
        {
          lineHeight: "0.6rem",
        },
      ],
      xs: [
        "0.7rem",
        {
          lineHeight: "0.8rem",
          letterSpacing: "0.2px",
        },
      ],
      sm: [
        "0.8rem",
        {
          lineHeight: "0.9rem",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1rem",
        },
      ],

      lg: [
        "1.525rem",
        {
          lineHeight: "1.55rem",
        },
      ],
    },
    // fontWeight: {
    //   thin: "100",
    //   extralight: "200",
    //   light: "300",
    //   normal: "400",
    //   medium: "500",
    //   semibold: "600",
    //   bold: "700",
    //   extrabold: "800",
    //   black: "900",
    // },
    colors: {
      "overlay-white": "rgba(255, 255, 255, 0.5)",
      ...colors,
    },
    extend: {
      colors: {
        green: {
          background: "#63c74d",
        },
        red: {
          background: "#e43b44",
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
          500: "#8b9bb4",
        },
        error: "#e43b44",
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
