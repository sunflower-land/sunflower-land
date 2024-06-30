import React from "react";

import snowglobe from "assets/decorations/snowglobe.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SnowGlobe: React.FC = () => {
  return (
    <>
      <img
        src={snowglobe}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 6}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
