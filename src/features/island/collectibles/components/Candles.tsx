import React from "react";

import candles from "assets/decorations/candles.png";
import candlesOn from "assets/decorations/candles_on.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

const isHalloween = () => {
  const today = new Date();
  const halloweenDate = new Date(today.getFullYear(), 9, 31); // Month is zero-based (9 represents October).

  return today.getDate() === 31 && today.getMonth() === 9;
};

export const Candles: React.FC = () => {
  return (
    <>
      <img
        src={isHalloween() ? candlesOn : candles}
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
