import React from "react";

import tree from "assets/sfts/christmas_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ChristmasTree: React.FC = () => {
  return (
    <img
      src={tree}
      style={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      className="absolute"
      alt="Christmas Tree"
    />
  );
};
