import React from "react";

import goldenCauliflower from "assets/nfts/golden_cauliflower.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const GoldenCauliflower: React.FC = () => {
  return (
    <img
      src={goldenCauliflower}
      style={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      alt="Golden Cauliflower"
    />
  );
};
