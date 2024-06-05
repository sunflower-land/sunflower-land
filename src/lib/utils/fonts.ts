const LOCAL_STORAGE_KEY = "settings.font";

export function cacheFont(font: Font) {
  localStorage.setItem(LOCAL_STORAGE_KEY, font);
}

export function getCachedFont(): Font {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!cached || !FONT_CONFIG[cached]) {
    return "Basic";
  }

  return cached as Font;
}

export type Font = "Basic" | "Secondary" | "sans-serif";
const FONT_CONFIG: Record<
  string,
  {
    fontFamily: string;
    xxs: [number, number];
    xs: [number, number];
    sm: [number, number];
    base: [number, number];
    lg: [number, number];
  }
> = {
  Basic: {
    fontFamily: "Basic",
    xxs: [20, 14],
    xs: [24, 14],
    sm: [30, 20],
    base: [36, 26],
    lg: [42, 32],
  },
  "sans-serif": {
    fontFamily: "sans-serif",
    xxs: [14, 14],
    xs: [16, 16],
    sm: [18, 18],
    base: [25, 25],
    lg: [30, 30],
  },
  Secondary: {
    fontFamily: "Secondary",
    xxs: [18, 12],
    xs: [24, 14],
    sm: [30, 20],
    base: [36, 26],
    lg: [42, 32],
  },
};

export function initialiseFont() {
  const font = getCachedFont();

  if (font !== "Basic") {
    changeFont(font);
  }
}

export function changeFont(font: Font) {
  const config = FONT_CONFIG[font];

  document.documentElement.style.setProperty(
    "--font-family",
    config.fontFamily
  );

  document.documentElement.style.setProperty(
    "--text-xxs-size",
    config.xxs[0] + "px"
  );
  document.documentElement.style.setProperty(
    "--text-xxs-line-height",
    config.xxs[1] + "px"
  );

  document.documentElement.style.setProperty(
    "--text-xs-size",
    config.xs[0] + "px"
  );
  document.documentElement.style.setProperty(
    "--text-xs-line-height",
    config.xs[1] + "px"
  );

  document.documentElement.style.setProperty(
    "--text-sm-size",
    config.sm[0] + "px"
  );
  document.documentElement.style.setProperty(
    "--text-sm-line-height",
    config.sm[1] + "px"
  );

  document.documentElement.style.setProperty(
    "--text-base-size",
    config.base[0] + "px"
  );
  document.documentElement.style.setProperty(
    "--text-base-line-height",
    config.base[1] + "px"
  );

  document.documentElement.style.setProperty(
    "--text-lg-size",
    config.lg[0] + "px"
  );

  document.documentElement.style.setProperty(
    "--text-lg-line-height",
    config.lg[1] + "px"
  );

  cacheFont(font);
}
