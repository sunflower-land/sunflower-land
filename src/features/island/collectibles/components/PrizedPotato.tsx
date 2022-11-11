import React from "react";

import prizedPotato from "assets/sfts/prized_potato.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PrizedPotato: React.FC = () => {
  return (
    <>
      <img
        src={prizedPotato}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute hover:img-highlight"
        alt="Prized Potato"
      />
    </>
  );
};
