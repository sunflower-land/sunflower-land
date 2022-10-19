import React from "react";

import goldEgg from "assets/nfts/gold_egg.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const GoldEgg: React.FC = () => {
  return (
    <img
      src={goldEgg}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Gold Egg"
    />
  );
};
