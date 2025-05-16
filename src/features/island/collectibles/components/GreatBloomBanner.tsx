import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const GreatBloomBanner: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        top: `${PIXEL_SCALE * -4}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Great Bloom Banner"].image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        alt="Great Bloom Banner"
      />
    </div>
  );
};
