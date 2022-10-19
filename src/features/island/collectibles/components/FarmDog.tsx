import React from "react";

import farmDog from "assets/nfts/farm_dog.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const FarmDog: React.FC = () => {
  return (
    <img
      src={farmDog}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Farm Dog"
    />
  );
};
