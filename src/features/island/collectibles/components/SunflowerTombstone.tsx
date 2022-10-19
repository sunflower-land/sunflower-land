import React from "react";

import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const SunflowerTombstone: React.FC = () => {
  return (
    <img
      src={sunflowerTombstone}
      style={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      alt="Sunflower Tombstone"
    />
  );
};
