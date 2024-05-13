import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/rookie_rook.webp";

export const RookieRook: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 10}px`,
        left: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      alt="RookieRook"
      className="absolute"
    />
  );
};
