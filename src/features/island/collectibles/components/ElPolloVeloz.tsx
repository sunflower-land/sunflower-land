import React from "react";

import elPolloVeloz from "assets/animals/chickens/el_pollo_veloz.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const ElPolloVeloz: React.FC = () => {
  return (
    <>
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
        }}
        className="absolute bottom-0 pointer-events-none"
      />
      <img
        src={elPolloVeloz}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="El Pollo Veloz"
      />
    </>
  );
};
