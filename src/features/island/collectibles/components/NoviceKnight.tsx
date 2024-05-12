import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/novice_knight.webp";

export const NoviceKnight: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        left: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute"
      alt="NoviceKnight"
    />
  );
};
