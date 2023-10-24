import React from "react";

import chillingBanana from "assets/sfts/chilling_banana.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ChillingBanana: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
    >
      <img
        src={chillingBanana}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Chilling Banana"
      />
    </div>
  );
};
