import React from "react";

import blackSheep from "assets/sfts/black_sheep.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BlackSheep: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
      }}
    >
      <img src={blackSheep} className="w-full" alt="Black Sheep" />
    </div>
  );
};
