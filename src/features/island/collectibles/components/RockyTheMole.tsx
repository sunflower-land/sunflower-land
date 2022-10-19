import React from "react";

import rockyTheMole from "assets/nfts/rocky_mole.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const RockyTheMole: React.FC = () => {
  return (
    <img
      src={rockyTheMole}
      style={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      alt="Rocky The Mole"
    />
  );
};
