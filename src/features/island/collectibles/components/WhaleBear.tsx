import React from "react";

import whaleBear from "assets/sfts/bears/whale_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WhaleBear: React.FC = () => {
  return (
    <>
      <img
        src={whaleBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Whale Bear"
      />
    </>
  );
};
