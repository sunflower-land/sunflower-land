// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      body: ['"Basic","LXGW WenKai TC"'],
      game: '"Sigmar One", cursive, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      pixel: ["Secondary"],
      error: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
      speech: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
    },
    fontSize: {
      xxs: [
        "var(--text-xxs-size)",
        {
          lineHeight: "var(--text-xxs-line-height)",
        },
      ],
      xs: [
        "var(--text-xs-size)",
        {
          lineHeight: "var(--text-xs-line-height)",
        },
      ],
      sm: [
        "var(--text-sm-size)",
        {
          lineHeight: "var(--text-sm-line-height)",
        },
      ],
      base: [
        "var(--text-base-size)",
        {
          lineHeight: "var(--text-base-line-height)",
        },
      ],
      lg: [
        "var(--text-lg-size)",
        {
          lineHeight: "var(--text-lg-line-height)",
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
