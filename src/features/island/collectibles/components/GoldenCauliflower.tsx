import React from "react";

import goldenCauliflower from "assets/sfts/golden_cauliflower.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenCauliflower: React.FC = () => {
  return (
    <img
      src={goldenCauliflower}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Golden Cauliflower"
    />
  );
};
