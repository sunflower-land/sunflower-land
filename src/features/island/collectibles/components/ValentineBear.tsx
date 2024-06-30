import React from "react";

import valentineBear from "assets/sfts/bears/love_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ValentineBear: React.FC = () => {
  return (
    <>
      <img
        src={valentineBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Valentine Bear"
      />
    </>
  );
};
