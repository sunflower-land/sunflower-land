import React from "react";

import image from "assets/decorations/shroom_glow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ShroomGlow: React.FC = () => {
  return (
    <>
      <img
        src={image}
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
