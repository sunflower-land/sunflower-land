import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import clock from "assets/sfts/clock.webp";

export const Clock: React.FC = () => {
  return (
    <img
      src={clock}
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Clock"
    />
  );
};
