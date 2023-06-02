import React from "react";

import gif from "assets/sfts/obie.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Obie: React.FC = () => {
  return (
    <>
      <img
        src={gif}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0.5}px`,
        }}
        className="absolute"
        alt="Obie"
      />
    </>
  );
};
