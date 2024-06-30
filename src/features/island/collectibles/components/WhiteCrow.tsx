import React from "react";

import whiteCrow from "assets/decorations/white_crow.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WhiteCrow: React.FC = () => {
  return (
    <>
      <img
        src={whiteCrow}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="White Crow"
      />
    </>
  );
};
