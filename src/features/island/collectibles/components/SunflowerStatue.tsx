import React from "react";

import sunflowerStatue from "assets/sfts/sunflower_statue.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SunflowerStatue: React.FC = () => {
  return (
    <img
      src={sunflowerStatue}
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Sunflower Statue"
    />
  );
};
