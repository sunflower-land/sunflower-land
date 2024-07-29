import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const Pyramid: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 30}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Pyramid"].image}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Pyramid"
      />
    </div>
  );
};
