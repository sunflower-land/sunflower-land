import React from "react";

import nana from "assets/sfts/nana.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Nana: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 17}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={nana}
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Nana"
      />
    </div>
  );
};
