import React from "react";

import image from "assets/sfts/purple_trail.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PurpleTrail: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0.5}px`,
        }}
        className="absolute"
        alt="Purple Trail"
      />
    </>
  );
};
