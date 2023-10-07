import { PIXEL_SCALE } from "./constants";
import grayBorder from "assets/ui/panel/gray_border.png";
import orangeBorder from "assets/ui/panel/orange_border.png";
import redBorder from "assets/ui/panel/danger_border.png";
import vibrantBorder from "assets/ui/panel/vibrant_border.png";
import lightBorder from "assets/ui/panel/light_border.png";
import darkBorder from "assets/ui/panel/dark_border.png";
import roomBorder from "assets/ui/panel/room_border.webp";
import tableBorder from "assets/ui/panel/table_border2.webp";
import greenBorder from "assets/ui/panel/green_border.png";
import tabBorderStart from "assets/ui/panel/tab_border_start.png";
import tabBorderMiddle from "assets/ui/panel/tab_border_middle.png";
import progressBarBorder from "assets/ui/progress/progress_bar_border.png";
import speechBubbleBorder from "assets/ui/speech_bubble.webp";

const pixelizedBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px`,
  borderImageSlice: "20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 5}px`,
};

export const pixelGrayBorderStyle: React.CSSProperties = {
  borderImage: `url(${grayBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelOrangeBorderStyle: React.CSSProperties = {
  borderImage: `url(${orangeBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelRedBorderStyle: React.CSSProperties = {
  borderImage: `url(${redBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelVibrantBorderStyle: React.CSSProperties = {
  borderImage: `url(${vibrantBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelLightBorderStyle: React.CSSProperties = {
  borderImage: `url(${lightBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelRoomBorderStyle: React.CSSProperties = {
  borderImage: `url(${roomBorder})`,
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 6}px`,
  borderImageSlice: "20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 8}px`,
};

export const pixelTableBorderStyle: React.CSSProperties = {
  borderImage: `url(${tableBorder})`,
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px ${PIXEL_SCALE * 2}px ${PIXEL_SCALE * 5}px`,
  borderImageSlice: "10% 10% 20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 2.8}px`,
};

export const pixelSpeechBubbleBorderStyle: React.CSSProperties = {
  borderImage: `url(${speechBubbleBorder})`,
  backgroundColor: "white",
  borderWidth: `${PIXEL_SCALE * 3}px`,
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
