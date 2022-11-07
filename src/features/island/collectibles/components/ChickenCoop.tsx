import React from "react";

import coop from "assets/sfts/chicken_coop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ChickenCoop: React.FC = () => {
  return (
    <img
      src={coop}
      style={{
        width: `${PIXEL_SCALE * 33}px`,
        bottom: `${PIXEL_SCALE}px`,
      }}
      className="absolute"
      alt="Chicken Coop"
    />
  );
};
