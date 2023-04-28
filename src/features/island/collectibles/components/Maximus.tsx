import React from "react";

import image from "assets/sfts/maximus.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Maximus: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 5.5}px`,
        }}
        className="absolute"
        alt="Maximus"
      />
    </>
  );
};
