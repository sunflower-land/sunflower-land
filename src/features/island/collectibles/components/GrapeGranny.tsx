import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import grapeGranny from "assets/sfts/grape_granny.webp";

export const GrapeGranny: React.FC = () => {
  return (
    <img
      src={grapeGranny}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Grape Granny"
    />
  );
};
