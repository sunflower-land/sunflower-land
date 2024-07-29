import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const TomatoClown: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Tomato Clown"].image}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
        alt="Tomato Clown"
      />
    </div>
  );
};
