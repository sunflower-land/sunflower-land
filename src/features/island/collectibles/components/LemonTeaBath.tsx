import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const LemonTeaBath: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 38}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 5}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Lemon Tea Bath"].image}
        style={{
          width: `${PIXEL_SCALE * 38}px`,
        }}
        alt="Lemon Tea Bath"
      />
    </div>
  );
};
