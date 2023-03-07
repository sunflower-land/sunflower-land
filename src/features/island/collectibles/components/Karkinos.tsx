import React from "react";

import karkinos from "assets/seasons/solar-flare/karkinos.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Karkinos: React.FC = () => {
  return (
    <>
      <img
        src={karkinos}
        style={{
          width: `${PIXEL_SCALE * 27}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Karkinos"
      />
    </>
  );
};
