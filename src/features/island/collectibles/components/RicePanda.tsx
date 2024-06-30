import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/rice_panda.webp";

export const RicePanda: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Rice Panda"
    />
  );
};
