import React from "react";

import farmDog from "assets/sfts/farm_dog.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FarmDog: React.FC = () => {
  return (
    <img
      src={farmDog}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px `,
      }}
      alt="Farm Dog"
    />
  );
};
