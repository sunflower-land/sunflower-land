import React from "react";

import coop from "assets/sfts/chicken_coop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ChickenCoop: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 33}px`,
        left: `${PIXEL_SCALE * -1}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={coop}
        style={{
          width: `${PIXEL_SCALE * 33}px`,
          bottom: `${PIXEL_SCALE}px`,
        }}
        alt="Chicken Coop"
      />
    </div>
  );
};
