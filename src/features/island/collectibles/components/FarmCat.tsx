import React from "react";

import cat from "assets/sfts/farm_cat.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FarmCat: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 20}px`,
        left: `${PIXEL_SCALE * -2}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={cat}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
        }}
        alt="Farm Cat"
      />
    </div>
  );
};
