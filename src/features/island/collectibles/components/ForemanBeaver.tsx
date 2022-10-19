import React from "react";

import foremanBeaver from "assets/nfts/construction_beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const ForemanBeaver: React.FC = () => {
  return (
    <img
      src={foremanBeaver}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Foreman Beaver"
    />
  );
};
