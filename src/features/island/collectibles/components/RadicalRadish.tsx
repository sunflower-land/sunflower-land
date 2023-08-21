import React from "react";

import radishMutant from "assets/sfts/radish_mutant.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RadicalRadish: React.FC = () => {
  return (
    <>
      <img
        src={radishMutant}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Radical Radish"
      />
    </>
  );
};
