import React from "react";

import scarecrow from "assets/nfts/scarecrow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Scarecrow: React.FC = () => {
  return (
    <img
      src={scarecrow}
      style={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      alt="Scarecrow"
    />
  );
};
