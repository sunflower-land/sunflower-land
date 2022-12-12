import React from "react";

import pottedPotato from "assets/decorations/potted_potato.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PottedPotato: React.FC = () => {
  return (
    <>
      <img
        src={pottedPotato}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute"
        alt="Potted Potato"
      />
    </>
  );
};
