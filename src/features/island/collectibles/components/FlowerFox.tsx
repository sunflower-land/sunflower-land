import React from "react";

import flowerFox from "assets/sfts/flower_fox.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FlowerFox: React.FC = () => {
  return (
    <div className="flex justify-center">
      <img
        src={flowerFox}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Flower Fox"
      />
    </div>
  );
};
