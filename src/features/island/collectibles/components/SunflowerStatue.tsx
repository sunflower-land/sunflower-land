import React from "react";

import sunflowerStatue from "assets/nfts/sunflower_statue.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const SunflowerStatue: React.FC = () => {
  return (
    <img
      src={sunflowerStatue}
      style={{
        width: `${PIXEL_SCALE * 49}px`,
      }}
      alt="Sunflower Statue"
    />
  );
};
