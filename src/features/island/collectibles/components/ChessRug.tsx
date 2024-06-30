import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/chess_rug.webp";

export const ChessRug: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="ChessRug"
    />
  );
};
