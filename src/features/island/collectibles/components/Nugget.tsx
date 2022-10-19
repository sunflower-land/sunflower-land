import React from "react";

import nugget from "assets/nfts/nugget.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Nugget: React.FC = () => {
  return (
    <img
      src={nugget}
      style={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      alt="Nugget"
    />
  );
};
