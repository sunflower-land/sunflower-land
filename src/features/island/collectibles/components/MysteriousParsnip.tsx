import React from "react";

import mysteriousParsnip from "assets/nfts/mysterious_parsnip.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const MysteriousParsnip: React.FC = () => {
  return (
    <img
      src={mysteriousParsnip}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      alt="Mysterious Parsnip"
    />
  );
};
