import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PottedSunflower: React.FC = () => {
  return (
    <>
      <img
        src={SUNNYSIDE.decorations.pottedSunflower}
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Potted Sunflower"
      />
    </>
  );
};
