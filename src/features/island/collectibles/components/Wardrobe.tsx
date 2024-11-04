import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const Wardrobe: React.FC = () => {
  return (
    <>
      <img
        src={SUNNYSIDE.decorations.wardrobe}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 6}px`,
          left: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute"
        alt="Wardrobe"
      />
    </>
  );
};
