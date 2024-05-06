import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import vinny from "assets/sfts/vinny.webp";

export const Vinny: React.FC = () => {
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
        src={vinny}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Vinny"
      />
    </div>
  );
};
