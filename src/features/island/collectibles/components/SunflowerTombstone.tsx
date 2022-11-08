import React from "react";

import sunflowerTombstone from "assets/sfts/sunflower_tombstone.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SunflowerTombstone: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        right: `${PIXEL_SCALE * 2.5}px`,
      }}
    >
      <img
        src={sunflowerTombstone}
        style={{
          width: `${PIXEL_SCALE * 26}px`,
        }}
        alt="Sunflower Tombstone"
      />
    </div>
  );
};
