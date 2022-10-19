import React from "react";

import speedChicken from "assets/animals/chickens/speed_chicken.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const SpeedChicken: React.FC = () => {
  return (
    <img
      src={speedChicken}
      style={{
        width: `${PIXEL_SCALE * 29.82}px`,
      }}
      alt="Speed Chicken"
    />
  );
};
