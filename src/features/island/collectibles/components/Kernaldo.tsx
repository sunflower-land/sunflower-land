import React from "react";

import kernaldo from "assets/sfts/kernaldo.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Kernaldo: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={kernaldo}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Kernaldo"
      />
    </div>
  );
};
