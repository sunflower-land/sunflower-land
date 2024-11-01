import React from "react";

import mootant from "assets/sfts/mootant.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Mootant: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img src={mootant} className="w-full" alt="Mootant" />
    </div>
  );
};
