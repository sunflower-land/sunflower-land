import React from "react";

import richChicken from "assets/animals/chickens/rich_chicken.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const RichChicken: React.FC = () => {
  return (
    <img
      src={richChicken}
      style={{
        width: `${PIXEL_SCALE * 29.82}px`,
      }}
      alt="Rich Chicken"
    />
  );
};
