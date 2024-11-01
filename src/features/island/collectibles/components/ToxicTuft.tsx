import React from "react";

import toxicTuft from "assets/sfts/toxic_tuft.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ToxicTuft: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img src={toxicTuft} className="w-full" alt="Toxic Tuft" />
    </div>
  );
};
