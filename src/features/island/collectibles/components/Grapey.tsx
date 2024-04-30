import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import grapey from "assets/sfts/grapey.webp";

export const Grapey: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: 0,
        left: `50%`,
        transform: "translatex(-50%)",
      }}
    >
      <img
        src={grapey}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Grapey"
      />
    </div>
  );
};
