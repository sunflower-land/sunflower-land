import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const Bed: React.FC = () => {
  return (
    <>
      <img
        src={SUNNYSIDE.decorations.bed}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          top: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Bed"
      />
    </>
  );
};
