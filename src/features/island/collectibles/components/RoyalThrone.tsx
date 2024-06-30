import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import royalThrone from "assets/sfts/royal_throne.webp";

export const RoyalThrone: React.FC = () => {
  return (
    <img
      src={royalThrone}
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Royal Throne"
    />
  );
};
