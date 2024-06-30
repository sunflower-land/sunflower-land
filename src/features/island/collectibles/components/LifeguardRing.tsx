import React from "react";

import lifeguardRing from "assets/decorations/lifeguard_ring.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LifeguardRing: React.FC = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={lifeguardRing}
          style={{
            width: `${PIXEL_SCALE * 17}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Lifeguard Ring"
        />
      </div>
    </>
  );
};
