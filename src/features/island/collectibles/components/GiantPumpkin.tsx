import React from "react";

import giantPumpkin from "assets/sfts/giant_pumpkin.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GiantPumpkin: React.FC = () => {
  return (
    <>
      <img
        src={giantPumpkin}
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        className="absolute pointer-events-none"
        alt="Giant Pumpkin"
      />
    </>
  );
};
