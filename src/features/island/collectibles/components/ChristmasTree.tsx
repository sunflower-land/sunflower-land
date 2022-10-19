import React from "react";

import tree from "assets/nfts/christmas_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const ChristmasTree: React.FC = () => {
  return (
    <img
      src={tree}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Christmas Tree"
    />
  );
};
