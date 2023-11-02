import React from "react";

import soilKrabby from "assets/sfts/soil_krabby.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SoilKrabby: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
    >
      <img
        src={soilKrabby}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Soil Krabby"
      />
    </div>
  );
};
