import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import flowerCart from "assets/sfts/flower_cart.webp";

export const FlowerCart: React.FC = () => {
  return (
    <img
      src={flowerCart}
      style={{
        width: `${PIXEL_SCALE * 29}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="Flower Cart"
    />
  );
};
