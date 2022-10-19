import React from "react";

import woodyTheBeaver from "assets/nfts/beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const WoodyTheBeaver: React.FC = () => {
  return (
    <img
      src={woodyTheBeaver}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Woody the Beaver"
    />
  );
};
