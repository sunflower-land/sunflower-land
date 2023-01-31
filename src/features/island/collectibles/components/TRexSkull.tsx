import React from "react";

import skull from "assets/sfts/t-rex-skull.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TRexSkull: React.FC = () => {
  return (
    <>
      <img
        src={skull}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
