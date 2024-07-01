import React from "react";

import surfboard from "assets/decorations/surfboard.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Surfboard: React.FC = () => {
  return (
    <>
      <img
        src={surfboard}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Surfboard"
      />
    </>
  );
};
