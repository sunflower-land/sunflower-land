import { PIXEL_SCALE } from "./constants";
import whiteBorder from "assets/ui/panel/white_border.png";
import lightBorder from "assets/ui/panel/light_border.png";
import darkBorder from "assets/ui/panel/dark_border.png";
import greenBorder from "assets/ui/panel/green_border.png";
import tabBorder from "assets/ui/panel/tab_border.png";

const pixelizedBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px`,
  borderImageSlice: "22.222222%",
  imageRendering: "pixelated",
  borderImageRepeat: "repeat",
  borderRadius: `${PIXEL_SCALE * 5}px`,
};

export const pixelWhiteBorderStyle: React.CSSProperties = {
  borderImage: `url(${whiteBorder}) 30 stretch`,
  ...pixelizedBorderStyle,
};

export const pixelLightBorderStyle: React.CSSProperties = {
  borderImage: `url(${lightBorder}) 30 stretch`,
  ...pixelizedBorderStyle,
};

export const pixelDarkBorderStyle: React.CSSProperties = {
  borderImage: `url(${darkBorder}) 30 stretch`,
  ...pixelizedBorderStyle,
};

export const pixelGreenBorderStyle: React.CSSProperties = {
  borderImage: `url(${greenBorder}) 30 stretch`,
  ...pixelizedBorderStyle,
};

export const pixelTabBorderStyle: React.CSSProperties = {
  borderImage: `url(${tabBorder}) 30 stretch`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};
