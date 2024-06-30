import React from "react";

import freyaFox from "assets/sfts/freya_fox.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FreyaFox: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={freyaFox}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Freya Fox"
      />
    </div>
  );
};
