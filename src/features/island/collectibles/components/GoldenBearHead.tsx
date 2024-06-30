import React from "react";

import headCase from "assets/sfts/golden_bear_head_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenBearHead: React.FC = () => {
  return (
    <>
      <img
        src={headCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="GoldenBearHead"
      />
    </>
  );
};
