import React from "react";

import goldenCauliflower from "assets/sfts/golden_cauliflower.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenCauliflower: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 3}px `,
        right: `${PIXEL_SCALE * 2}px `,
      }}
    >
      <img
        src={goldenCauliflower}
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 3}px `,
          right: `${PIXEL_SCALE * 2}px `,
        }}
        alt="Golden Cauliflower"
      />
    </div>
  );
};
