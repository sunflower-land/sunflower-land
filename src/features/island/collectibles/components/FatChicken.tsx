import React from "react";

import fatChicken from "assets/animals/chickens/fat_chicken.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const FatChicken: React.FC = () => {
  return (
    <img
      src={fatChicken}
      style={{
        width: `${PIXEL_SCALE * 29.82}px`,
      }}
      alt="Fat Chicken"
    />
  );
};
