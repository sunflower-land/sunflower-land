import React from "react";

import spookyTree from "assets/decorations/spooky_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SpookyTree: React.FC = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `-${PIXEL_SCALE * 4}px`,
        }}
      >
        <img
          src={spookyTree}
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Spooky Tree"
        />
      </div>
    </>
  );
};
