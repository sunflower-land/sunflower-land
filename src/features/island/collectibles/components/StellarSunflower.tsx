import React from "react";

import sunflowerMutant from "assets/sfts/sunflower_mutant.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const StellarSunflower: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        right: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={sunflowerMutant}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
        alt="Stellar Sunflower"
      />
    </div>
  );
};
