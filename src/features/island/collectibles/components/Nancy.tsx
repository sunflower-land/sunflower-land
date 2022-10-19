import React from "react";

import nancy from "assets/nfts/nancy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Nancy: React.FC = () => {
  return (
    <img
      src={nancy}
      style={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      alt="Nancy"
    />
  );
};
