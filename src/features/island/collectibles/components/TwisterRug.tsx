import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/twister_rug.webp";

export const TwisterRug: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="TwisterRug"
    />
  );
};
