import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import flowerRug from "assets/sfts/flower_rug.webp";

export const FlowerRug: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center items-center"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        height: `${PIXEL_SCALE * 49}px`,
      }}
    >
      <img src={flowerRug} className="w-full h-full" alt="Flower Rug" />
    </div>
  );
};
