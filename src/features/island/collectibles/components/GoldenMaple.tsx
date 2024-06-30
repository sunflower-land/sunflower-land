import React from "react";

import goldenMaple from "assets/decorations/golden_maple.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenMaple: React.FC = () => {
  return (
    <>
      <img
        src={goldenMaple}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Golden Maple"
      />
    </>
  );
};
