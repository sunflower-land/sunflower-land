import React from "react";

import giantPotato from "assets/sfts/giant_potato.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GiantPotato: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center items-end"
      style={{
        width: `${PIXEL_SCALE * 17}px`,
        height: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: "-1px",
      }}
    >
      <img src={giantPotato} className="w-full h-full" alt="Giant Potato" />
    </div>
  );
};
