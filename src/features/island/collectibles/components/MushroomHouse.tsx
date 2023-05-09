import React from "react";

import mushroomHouse from "assets/seasons/dawn-breaker/mushroom_house.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const MushroomHouse: React.FC = () => {
  return (
    <>
      <img
        src={mushroomHouse}
        style={{
          width: `${PIXEL_SCALE * 37}px`,
        }}
        className="absolute"
        alt="Mushroom House"
      />
    </>
  );
};
