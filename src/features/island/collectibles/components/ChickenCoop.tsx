import React from "react";

import coop from "assets/nfts/chicken_coop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const ChickenCoop: React.FC = () => {
  return (
    <img
      src={coop}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      id="Chicken Coop"
    />
  );
};
