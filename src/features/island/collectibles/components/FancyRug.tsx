import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import fancyRug from "assets/sfts/fancy_rug.webp";

export const FancyRug: React.FC = () => {
  return (
    <img
      src={fancyRug}
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Fancy Rug"
    />
  );
};
