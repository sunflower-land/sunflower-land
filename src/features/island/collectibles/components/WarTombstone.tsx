import React from "react";

import tombstone from "assets/decorations/war_tombstone.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const WarTombstone: React.FC = () => {
  return (
    <img
      src={tombstone}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        left: `${PIXEL_SCALE}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
    />
  );
};
