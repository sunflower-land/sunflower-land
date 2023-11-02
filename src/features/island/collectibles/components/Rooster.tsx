import React from "react";

import rooster from "assets/animals/chickens/rooster.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Rooster: React.FC = () => {
  return (
    <img
      src={rooster}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px `,
      }}
      alt="Rooster"
      className="absolute"
    />
  );
};
