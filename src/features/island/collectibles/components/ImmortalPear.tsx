import React from "react";

import immortalPear from "assets/sfts/immortal_pear.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ImmortalPear: React.FC = () => {
  return (
    <>
      <img
        src={immortalPear}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
