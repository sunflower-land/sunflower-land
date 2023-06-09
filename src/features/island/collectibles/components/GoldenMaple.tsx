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
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        alt="Golden Maple"
      />
    </>
  );
};
