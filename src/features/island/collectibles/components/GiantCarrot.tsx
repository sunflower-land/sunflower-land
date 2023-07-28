import React from "react";

import giantCarrot from "assets/sfts/giant_carrot.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GiantCarrot: React.FC = () => {
  return (
    <img
      src={giantCarrot}
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      className="absolute pointer-events-none"
      alt="Giant Carrot"
    />
  );
};
