import React from "react";

import fatChicken from "assets/animals/chickens/fat_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FatChicken: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 17}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img
        src={fatChicken}
        style={{
          width: `${PIXEL_SCALE * 17}px`,
        }}
        alt="Fat Chicken"
      />
    </div>
  );
};
