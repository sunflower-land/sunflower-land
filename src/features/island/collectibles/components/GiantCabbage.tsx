import React from "react";

import giantCabbage from "assets/sfts/giant_cabbage.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GiantCabbage: React.FC = () => {
  return (
    <>
      <img
        src={giantCabbage}
        style={{
          width: `${PIXEL_SCALE * 27}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Giant Cabbage"
      />
    </>
  );
};
