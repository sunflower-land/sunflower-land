import React from "react";

import scarlet from "assets/decorations/scarlet.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Scarlet: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 9}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 3.5}px`,
      }}
    >
      <img
        src={scarlet}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
        }}
        alt="Scarlet"
      />
    </div>
  );
};
