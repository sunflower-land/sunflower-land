import { PIXEL_SCALE } from "./constants";
import { SUNNYSIDE } from "assets/sunnyside";

// Add Halloween border imports
import halloweenBorderInner from "assets/ui/halloweenBorderInner.png";
import halloweenBorderOuter from "assets/ui/halloweenBorderOuter.png";
import halloweenTabBorderInner1 from "assets/ui/halloweenTabBorderInner1.png";
import halloweenTabBorderInner2 from "assets/ui/halloweenTabBorderInner2.png";

import interactionBorder from "assets/ui/interaction_border.webp";
import chatInputBorder from "assets/ui/chat_input_border.webp";

import unselectedChip from "assets/ui/unselected_chip.png";
import selectedChip from "assets/ui/selected_chip.png";

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

export const pixelInteractionBorderStyle: React.CSSProperties = {
  borderImage: `url(${interactionBorder}) 20%`,
  ...pixelizedBorderStyle,
};

export const pixelChatInputBorderStyle: React.CSSProperties = {
  borderImage: `url(${chatInputBorder}) 21%`,
  ...pixelizedBorderStyle,
  borderWidth: `${PIXEL_SCALE * 3}px`,
};

// Clickable filter "chips" - a pixel border with a small drop shadow baked
// into the bottom of the art (thicker bottom slice) to give the affordance of
// a pressable element, distinct from non-clickable Labels. The unselected and
// selected variants use different colours so the state is readable at a glance
// without reusing the reward-yellow Label.
// NOTE: use the `borderImageSource` LONGHAND, never the `borderImage`
// shorthand. The shorthand resets every other `border-image-*` longhand
// (notably `border-image-slice`) to its initial value. On a React style update
// that swaps only the source, the shorthand would wipe the slice back to 100%
// (stretching the whole 14x9 source into the border) while React skips
// re-applying the unchanged slice - breaking the chip when it toggles
// selected. The longhand touches nothing but the image source.
const pixelChipBorderBase: React.CSSProperties = {
  borderStyle: "solid",
  imageRendering: "pixelated",
  borderImageRepeat: "stretch",
  // Source art is 14x9 with a 2px top/side border and a 4px bottom (the drop
  // shadow). Slice top/right/bottom/left so only the flat fill is left in the
  // centre for the element background to show through.
  borderImageSlice: "2 2 4 2",
  borderTopWidth: `${PIXEL_SCALE * 2}px`,
  borderLeftWidth: `${PIXEL_SCALE * 2}px`,
  borderRightWidth: `${PIXEL_SCALE * 2}px`,
  borderBottomWidth: `${PIXEL_SCALE * 4}px`,
  borderRadius: `${PIXEL_SCALE * 3}px`,
};

export const pixelChipBorderStyle: React.CSSProperties = {
  ...pixelChipBorderBase,
  borderImageSource: `url(${unselectedChip})`,
};

export const pixelChipSelectedBorderStyle: React.CSSProperties = {
  ...pixelChipBorderBase,
  borderImageSource: `url(${selectedChip})`,
};
