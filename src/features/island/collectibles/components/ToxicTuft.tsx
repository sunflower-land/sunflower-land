import React from "react";

import toxicTuft from "assets/sfts/toxic_tuft.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ToxicTuft: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
      }}
    >
      <img src={toxicTuft} className="w-full" alt="Toxic Tuft" />
    </div>
  );
};
