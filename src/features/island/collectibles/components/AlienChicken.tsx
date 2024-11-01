import React from "react";

import alienChicken from "assets/sfts/alien_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AlienChicken: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img
        src={alienChicken}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        alt="Alien Chicken"
      />
    </div>
  );
};
