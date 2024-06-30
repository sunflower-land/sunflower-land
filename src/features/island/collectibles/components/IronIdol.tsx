import React from "react";

import IdolCase from "assets/sfts/iron_idol_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const IronIdol: React.FC = () => {
  return (
    <>
      <img
        src={IdolCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Iron Idol"
      />
    </>
  );
};
