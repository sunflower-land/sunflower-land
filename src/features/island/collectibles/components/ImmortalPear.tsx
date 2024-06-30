import React from "react";

import immortalPear from "assets/sfts/immortal_pear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ImmortalPear: React.FC = () => {
  return (
    <>
      <img
        src={immortalPear}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="absolute"
        alt="Immortal Pear"
      />
    </>
  );
};
