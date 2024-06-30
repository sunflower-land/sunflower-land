import React from "react";

import pottedPumpkin from "assets/decorations/potted_pumpkin.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PottedPumpkin: React.FC = () => {
  return (
    <>
      <img
        src={pottedPumpkin}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute"
        alt="Potted Pumpkin"
      />
    </>
  );
};
