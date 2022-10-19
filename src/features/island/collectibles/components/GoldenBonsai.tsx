import React from "react";

import goldenBonsai from "assets/nfts/golden_bonsai.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const GoldenBonsai: React.FC = () => {
  return (
    <img
      src={goldenBonsai}
      style={{
        width: `${PIXEL_SCALE * 45.998}px`,
      }}
      alt="Golden Bonsai"
    />
  );
};
