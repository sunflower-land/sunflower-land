import React from "react";

import wendy from "assets/sfts/wood_nymph_wendy.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WoodNymphWendy: React.FC = () => {
  return (
    <>
      <img
        src={wendy}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Wood Nymph Wendy"
      />
    </>
  );
};
