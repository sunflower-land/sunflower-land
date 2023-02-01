import React from "react";

import goblinBear from "assets/sfts/bears/goblin_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoblinBear: React.FC = () => {
  return (
    <>
      <img
        src={goblinBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Goblin Bear"
      />
    </>
  );
};
