import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoogleButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <button
      className="w-full p-1 object-contain justify-center items-center cursor-pointer flex mb-1 text-sm relative h-[52px] "
      type="button"
      style={{
        borderImage: `url(${SUNNYSIDE.ui.greyButton})`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        borderImageSlice: "3 3 4 3 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        borderRadius: `${PIXEL_SCALE * 5}px`,
        color: "#674544",
      }}
      onClick={onClick}
    >
      <img src={SUNNYSIDE.icons.googleIcon} />
    </button>
  );
};
