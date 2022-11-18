import React from "react";

import farmDog from "assets/sfts/farm_dog.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FarmDog: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px `,
        bottom: `${PIXEL_SCALE * 0}px `,
      }}
    >
      <img
        src={farmDog}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        alt="Farm Dog"
      />
    </div>
  );
};
