import React from "react";

import hummingBird from "assets/sfts/hummingbird.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const HummingBird: React.FC = () => {
  return (
    <img
      src={hummingBird}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Humming Bird"
    />
  );
};
