import React from "react";

import sirGoldenSnout from "assets/sfts/aoe/sir_goldensnout.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SirGoldenSnout: React.FC = () => {
  return (
    <>
      <img
        src={sirGoldenSnout}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Sir Goldensnout"
      />
    </>
  );
};
