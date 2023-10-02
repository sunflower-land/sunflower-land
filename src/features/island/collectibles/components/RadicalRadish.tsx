import React from "react";

import radishMutant from "assets/sfts/radish_mutant.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RadicalRadish: React.FC = () => {
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
        src={radishMutant}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
        alt="Radical Radish"
      />
    </div>
  );
};
