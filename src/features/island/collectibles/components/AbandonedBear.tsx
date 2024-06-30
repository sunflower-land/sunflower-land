import React from "react";

import abandonedBear from "assets/sfts/bears/abandoned_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AbandonedBear: React.FC = () => {
  return (
    <>
      <img
        src={abandonedBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Abandoned Bear"
      />
    </>
  );
};
