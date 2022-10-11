import React from "react";

import skulls from "assets/decorations/war_skulls.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const WarSkulls: React.FC = () => {
  return (
    <img
      src={skulls}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
      }}
    />
  );
};
