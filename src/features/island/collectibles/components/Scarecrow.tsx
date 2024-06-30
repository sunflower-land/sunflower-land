import React from "react";

import scarecrow from "assets/sfts/scarecrow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Scarecrow: React.FC = () => {
  return (
    <img
      src={scarecrow}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      alt="Scarecrow"
    />
  );
};
