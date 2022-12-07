import React from "react";

import pottedSunflower from "assets/decorations/potted_sunflower.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PottedSunflower: React.FC = () => {
  return (
    <>
      <img
        src={pottedSunflower}
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
