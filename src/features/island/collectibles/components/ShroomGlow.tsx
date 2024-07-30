import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ShroomGlow: React.FC = () => {
  return (
    <>
      <img
        src={SUNNYSIDE.decorations.shroomGlow}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Shroom Glow"
      />
    </>
  );
};
