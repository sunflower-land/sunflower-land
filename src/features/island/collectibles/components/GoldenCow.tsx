import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/golden_cow.webp";

export const GoldenCow: React.FC = () => {
  return (
    <div
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
    >
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Golden Cow"
      />
    </div>
  );
};
