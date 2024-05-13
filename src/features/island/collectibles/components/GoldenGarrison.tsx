import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/golden_garrison.webp";

export const GoldenGarrison: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 10}px`,
        left: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute"
      alt="GoldenGarrison"
    />
  );
};
