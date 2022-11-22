import React from "react";

import goldEgg from "assets/sfts/gold_egg.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldEgg: React.FC = () => {
  return (
    <img
      src={goldEgg}
      style={{
        width: `${PIXEL_SCALE * 10}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      className="absolute"
      alt="Gold Egg"
    />
  );
};
