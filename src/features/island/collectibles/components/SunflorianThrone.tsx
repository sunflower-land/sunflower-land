import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/sunflorian_throne.webp";

export const SunflorianThrone: React.FC = () => {
  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Sunflorian Throne"
      />
    </div>
  );
};
