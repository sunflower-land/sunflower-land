import React from "react";

import scarecrow from "assets/sfts/scarecrow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Scarecrow: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        right: `${PIXEL_SCALE * 2.5}px`,
      }}
    >
      <img
        src={scarecrow}
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          right: `${PIXEL_SCALE * 2.5}px`,
        }}
        alt="Scarecrow"
      />
    </div>
  );
};
