import React from "react";

import homelessTent from "assets/nfts/homeless_tent.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const HomelessTent: React.FC = () => {
  return (
    <img
      src={homelessTent}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="homeless Tent"
    />
  );
};
