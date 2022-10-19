import React from "react";

import rooster from "assets/nfts/rooster.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Rooster: React.FC = () => {
  return (
    <img
      src={rooster}
      style={{
        width: `${PIXEL_SCALE * 29.82}px`,
      }}
      alt="Rooster"
    />
  );
};
