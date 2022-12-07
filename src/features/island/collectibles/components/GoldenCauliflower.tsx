import React from "react";

import goldenCauliflower from "assets/sfts/golden_cauliflower.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenCauliflower: React.FC = () => {
  return (
    <img
      src={goldenCauliflower}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 3}px `,
        left: `${PIXEL_SCALE * 4}px `,
      }}
      alt="Golden Cauliflower"
    />
  );
};
