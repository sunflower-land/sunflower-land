import React from "react";

import basicScarecrow from "assets/sfts/aoe/basic_scarecrow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const BasicScarecrow: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={basicScarecrow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="Basic Scarecrow"
      />
    </div>
  );
};
