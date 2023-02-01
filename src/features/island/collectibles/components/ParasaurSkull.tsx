import React from "react";

import skullCase from "assets/sfts/parasaur_skull_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ParasaurSkull: React.FC = () => {
  return (
    <>
      <img
        src={skullCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Parasaur Skull"
      />
    </>
  );
};
