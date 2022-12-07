import React from "react";

import basket from "assets/sfts/easter/basket.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const EggBasket: React.FC = () => {
  return (
    <img
      src={basket}
      style={{
        width: `${PIXEL_SCALE * 12}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute"
      alt="Egg Basket"
    />
  );
};
