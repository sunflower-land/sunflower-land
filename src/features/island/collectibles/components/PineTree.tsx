import React from "react";

import pineTree from "assets/decorations/pine_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PineTree: React.FC = () => {
  return (
    <>
      <img
        src={pineTree}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Pine Tree"
      />
    </>
  );
};
