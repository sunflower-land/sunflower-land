import React from "react";

import candles from "assets/decorations/candles.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Candles: React.FC = () => {
  return (
    <>
      <img
        src={candles}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Candles"
      />
    </>
  );
};
