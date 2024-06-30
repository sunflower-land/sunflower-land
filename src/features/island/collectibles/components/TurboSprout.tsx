import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import turboSprout from "assets/sfts/turbo_sprout.webp";

export const TurboSprout: React.FC = () => {
  return (
    <img
      src={turboSprout}
      style={{
        width: `${PIXEL_SCALE * 29}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Turbo Sprout"
    />
  );
};
