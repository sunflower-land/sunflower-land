import React from "react";

import image from "assets/decorations/grubnash_tombstone.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GrubnashTombstone: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
        }}
        className="absolute"
        alt="Grubnash Tombstone"
      />
    </>
  );
};
