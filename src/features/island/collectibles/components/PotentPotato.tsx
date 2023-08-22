import React from "react";

import potatoMutant from "assets/sfts/potato_mutant.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PotentPotato: React.FC = () => {
  return (
    <>
      <img
        src={potatoMutant}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Potent Potato"
      />
    </>
  );
};
