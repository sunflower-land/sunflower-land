import React from "react";

import blossomTree from "assets/events/valentine/sfts/blossom_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BlossomTree: React.FC = () => {
  return (
    <>
      <img
        src={blossomTree}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute pointer-events-none"
        alt="Blossom Tree"
      />
    </>
  );
};
