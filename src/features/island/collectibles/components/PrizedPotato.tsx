import React from "react";

import prizedPotato from "assets/sfts/prized_potato.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PrizedPotato: React.FC = () => {
  return (
    <>
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0.1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute w-full left z-29"
      />
      <img
        src={prizedPotato}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Prized Potato"
      />
    </>
  );
};
