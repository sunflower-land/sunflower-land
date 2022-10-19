import React from "react";

import cat from "assets/nfts/farm_cat.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const FarmCat: React.FC = () => {
  return (
    <img
      src={cat}
      style={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      alt="Farm Cat"
    />
  );
};
