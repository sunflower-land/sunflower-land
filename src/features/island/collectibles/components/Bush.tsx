import React from "react";

import bush from "assets/decorations/bush.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Bush: React.FC = () => {
  return (
    <>
      <img
        src={bush}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Bush"
      />
    </>
  );
};
