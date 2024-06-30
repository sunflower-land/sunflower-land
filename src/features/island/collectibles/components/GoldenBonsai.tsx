import React from "react";

import goldenBonsai from "assets/sfts/golden_bonsai.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoldenBonsai: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 0}px `,
        right: `${PIXEL_SCALE * -1}px `,
      }}
    >
      <img
        src={goldenBonsai}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
        }}
        alt="Golden Bonsai"
      />
    </div>
  );
};
