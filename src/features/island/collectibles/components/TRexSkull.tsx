import React from "react";

import skullCase from "assets/sfts/t_rex_skull_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TRexSkull: React.FC = () => {
  return (
    <>
      <img
        src={skullCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="T-Rex Skull"
      />
    </>
  );
};
