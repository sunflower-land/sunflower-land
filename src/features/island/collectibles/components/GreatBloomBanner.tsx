import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const GreatBloomBanner: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        top: `${PIXEL_SCALE * -5}px`,
        left: `${PIXEL_SCALE * -1.5}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Great Bloom Banner"].image}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
        }}
        alt="Great Bloom Banner"
      />
    </div>
  );
};
