import React from "react";

import krakenHead from "assets/sfts/kraken_head.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const KrakenHead: React.FC = () => {
  return (
    <img
      src={krakenHead}
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 -translate-x-1/2"
      alt="Kraken Head"
    />
  );
};
