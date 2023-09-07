import React from "react";

import composter from "assets/sfts/aoe/composter.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const MediumComposter: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <img
        src={composter}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Advanced Composter"
      />
    </div>
  );
};
