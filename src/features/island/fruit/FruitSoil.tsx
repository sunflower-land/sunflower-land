import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const FruitSoil: React.FC = () => {
  return (
    <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
      <img
        src={SUNNYSIDE.soil.soil2}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * 8}px`,
          bottom: `${PIXEL_SCALE * 9}px`,
        }}
      />
    </div>
  );
};
