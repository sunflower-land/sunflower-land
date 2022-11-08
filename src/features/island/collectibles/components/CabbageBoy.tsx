import React from "react";

import cabbageBoy from "assets/sfts/cabbage_boy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CabbageBoy: React.FC = () => {
  return (
    <>
      <img
        src={cabbageBoy}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Cabbage Boy"
      />
    </>
  );
};
