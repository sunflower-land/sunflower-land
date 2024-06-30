import React from "react";

import bear from "assets/sfts/grinx_hammer.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GrinxsHammer: React.FC = () => {
  return (
    <>
      <img
        src={bear}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Grinx Hammer"
      />
    </>
  );
};
