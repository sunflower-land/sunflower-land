import React from "react";

import elPolloVeloz from "assets/animals/chickens/el_pollo_veloz.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ElPolloVeloz: React.FC = () => {
  return (
    <>
      <img
        src={elPolloVeloz}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="El Pollo Veloz"
      />
    </>
  );
};
