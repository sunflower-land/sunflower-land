import React from "react";

import whiteFox from "assets/sfts/white-xmas-fox.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WhiteFestiveFox: React.FC = () => {
  return (
    <>
      <img
        src={whiteFox}
        style={{
          width: `${PIXEL_SCALE * 33}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="White Festive Fox"
      />
    </>
  );
};
