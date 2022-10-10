import React from "react";

import mysteriousHead from "assets/nfts/mysterious_head.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const MysteriousHead: React.FC = () => {
  return (
    <img
      src={mysteriousHead}
      style={{
        width: `${PIXEL_SCALE * 30}px`,
      }}
    />
  );
};
