import React from "react";

import lifeguardBear from "assets/sfts/bears/lifeguard_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LifeguardBear: React.FC = () => {
  return (
    <>
      <img
        src={lifeguardBear}
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Lifeguard Bear"
      />
    </>
  );
};
