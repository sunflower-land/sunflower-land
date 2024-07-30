import { PIXEL_SCALE } from "./constants";
import { SUNNYSIDE } from "assets/sunnyside";

const pixelizedBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px`,
  borderImageSlice: "20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 5}px`,
};

export const pixelGrayBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.grayBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelOrangeBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.orangeBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelRedBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.redBorder})`,
  ...{ ...pixelizedBorderStyle },
};

export const pixelVibrantBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.vibrantBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelBlueBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.blueBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelFormulaBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.formulaBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelCalmBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.calmBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelLightBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.lightBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelRoomBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.roomBorder})`,
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 6}px`,
  borderImageSlice: "20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 8}px`,
};

export const pixelTableBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tableBorder})`,
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px ${PIXEL_SCALE * 2}px ${PIXEL_SCALE * 5}px`,
  borderImageSlice: "10% 10% 20%",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 2.8}px`,
};

export const pixelSpeechBubbleBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.speechBubbleBorder})`,
  backgroundColor: "white",
  borderWidth: `${PIXEL_SCALE * 3}px`,
  ...pixelizedBorderStyle,
};

export const pixelDarkBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.darkBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelGreenBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.greenBorder})`,
  ...pixelizedBorderStyle,
};

export const pixelTabBorderStartStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderStart})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelTabBorderMiddleStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderMiddle})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelTabBorderVerticalStartStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderVerticalStart})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px 0 0 ${PIXEL_SCALE * 5}px`,
};

export const pixelTabBorderVerticalMiddleStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderVerticalMiddle})`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px 0 0 ${PIXEL_SCALE * 5}px`,
};

export const progressBarBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.progressBarBorder})`,
  ...pixelizedBorderStyle,
  borderLeftWidth: `${PIXEL_SCALE * 2}px`,
  borderRightWidth: `${PIXEL_SCALE * 2}px`,
  borderTopWidth: `${PIXEL_SCALE * 2}px`,
  borderBottomWidth: `${PIXEL_SCALE * 3}px`,
  borderImageSlice: "20% 20% 30%",
};
