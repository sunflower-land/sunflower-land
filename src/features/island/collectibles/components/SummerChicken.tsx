import React from "react";

import summerChicken from "assets/sfts/summer_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SummerChicken: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 21}px`,
      }}
    >
      <img src={summerChicken} className="w-full" alt="Summer Chicken" />
    </div>
  );
};
