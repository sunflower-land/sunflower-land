import React from "react";

import laurie from "assets/sfts/aoe/laurie.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const LaurieTheChuckleCrow: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -4}px`,
      }}
    >
      <img
        src={laurie}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="Laurie the Chuckle Crow"
      />
    </div>
  );
};
