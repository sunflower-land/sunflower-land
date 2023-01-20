import { PIXEL_SCALE } from "./constants";
import whiteBorder from "assets/ui/panel/white_border.png";
import lightBorder from "assets/ui/panel/light_border.png";
import darkBorder from "assets/ui/panel/dark_border.png";
import greenBorder from "assets/ui/panel/green_border.png";
import tabBorderStart from "assets/ui/panel/tab_border_start.png";
import tabBorderMiddle from "assets/ui/panel/tab_border_middle.png";
import progressBarBorder from "assets/ui/progress/progress_bar_border.png";
import progressBarBorderOpacity60 from "assets/ui/progress/progress_bar_border_opacity_60.png";

const pixelizedBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px`,
  borderImageSlice: "20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 5}px`,
};

export const pixelWhiteBorderStyle: React.CSSProperties = {
  borderImage: `url(${whiteBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelLightBorderStyle: React.CSSProperties = {
  borderImage: `url(${lightBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelDarkBorderStyle: React.CSSProperties = {
  borderImage: `url(${darkBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelGreenBorderStyle: React.CSSProperties = {
  borderImage: `url(${greenBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelTabBorderStartStyle: React.CSSProperties = {
  borderImage: `url(${tabBorderStart})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelTabBorderMiddleStyle: React.CSSProperties = {
  borderImage: `url(${tabBorderMiddle})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const progressBarBorderStyle: React.CSSProperties = {
  borderImage: `url(${progressBarBorder})`,
  ...pixelizedBorderStyle,
  borderLeftWidth: `${PIXEL_SCALE * 2}px`,
  borderRightWidth: `${PIXEL_SCALE * 2}px`,
  borderTopWidth: `${PIXEL_SCALE * 2}px`,
  borderBottomWidth: `${PIXEL_SCALE * 3}px`,
  borderImageSlice: "20% 20% 30%",
};

export const progressBarBorderOpacity60Style: React.CSSProperties = {
  ...progressBarBorderStyle,
  borderImage: `url(${progressBarBorderOpacity60})`,
};
