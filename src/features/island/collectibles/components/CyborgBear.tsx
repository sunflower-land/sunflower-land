import React from "react";

import cyborgBear from "assets/sfts/bears/cyborg_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CyborgBear: React.FC = () => {
  return (
    <>
      <img
        src={cyborgBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Cyborg Bear"
      />
    </>
  );
};
