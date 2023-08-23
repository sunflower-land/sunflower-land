import React from "react";

import sunflowerMutant from "assets/sfts/sunflower_mutant.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const StellarSunflower: React.FC = () => {
  return (
    <>
      <img
        src={sunflowerMutant}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Stellar Sunflower"
      />
    </>
  );
};
