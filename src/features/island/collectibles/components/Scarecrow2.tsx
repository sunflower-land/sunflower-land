import React from "react";

import scarecrow2 from "assets/sfts/aoe/scarecrow2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Scarecrow2: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={scarecrow2}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="Scarecrow 2"
      />
    </div>
  );
};
