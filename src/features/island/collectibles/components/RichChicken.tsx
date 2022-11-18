import React from "react";

import richChicken from "assets/animals/chickens/rich_chicken.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RichChicken: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 22}px `,
        bottom: `${PIXEL_SCALE * 0}px `,
        right: `${PIXEL_SCALE * -2}px `,
      }}
    >
      <img
        src={richChicken}
        style={{
          width: `${PIXEL_SCALE * 22}px `,
          bottom: `${PIXEL_SCALE * 0}px `,
          right: `${PIXEL_SCALE * -2}px `,
        }}
        className="absolute"
        alt="Rich Chicken"
      />
    </div>
  );
};
