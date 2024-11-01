import { PIXEL_SCALE } from "./constants";
import { SUNNYSIDE } from "assets/sunnyside";

// Add Halloween border imports
import halloweenBorderInner from "assets/ui/halloweenBorderInner.png";
import halloweenBorderOuter from "assets/ui/halloweenBorderOuter.png";
import halloweenTabBorderInner1 from "assets/ui/halloweenTabBorderInner1.png";
import halloweenTabBorderInner2 from "assets/ui/halloweenTabBorderInner2.png";

const pixelizedBorderStyle: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: `${PIXEL_SCALE * 2}px`,
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  borderRadius: `${PIXEL_SCALE * 5}px`,
};

export const pixelGrayBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.grayBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelOrangeBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.orangeBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelRedBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.redBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelVibrantBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.vibrantBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelBlueBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.blueBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelFormulaBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.formulaBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelCalmBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.calmBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelLightBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.lightBorder}) 20%`,
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
  borderImage: `url(${SUNNYSIDE.ui.speechBubbleBorder}) 20%`,
  backgroundColor: "white",
  borderWidth: `${PIXEL_SCALE * 3}px`,
  ...pixelizedBorderStyle,
};

export const pixelDarkBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.darkBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelGreenBorderStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.greenBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelTabBorderStartStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderStart}) 20%`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelTabBorderMiddleStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderMiddle}) 20%`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelTabBorderVerticalStartStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderVerticalStart}) 20%`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px 0 0 ${PIXEL_SCALE * 5}px`,
};

export const pixelTabBorderVerticalMiddleStyle: React.CSSProperties = {
  borderImage: `url(${SUNNYSIDE.ui.tabBorderVerticalMiddle}) 20%`,
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

//Halloween
export const pixelHalloweenInnerBorderStyle: React.CSSProperties = {
  borderImage: `url(${halloweenBorderInner}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelHalloweenOuterBorderStyle: React.CSSProperties = {
  borderImage: `url(${halloweenBorderOuter}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelHalloweenTabBorderMiddleStyle1: React.CSSProperties = {
  borderImage: `url(${halloweenTabBorderInner1}) 20%`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};

export const pixelHalloweenTabBorderMiddleStyle2: React.CSSProperties = {
  borderImage: `url(${halloweenTabBorderInner2}) 20%`,
  ...pixelizedBorderStyle,
  borderRadius: `${PIXEL_SCALE * 5}px ${PIXEL_SCALE * 5}px 0 0`,
};
