import React from "react";

import krakenTentacle from "assets/sfts/kraken_tentacle.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const KrakenTentacle: React.FC = () => {
  return (
    <img
      src={krakenTentacle}
      style={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 -translate-x-1/2"
      alt="Kraken Tentacle"
    />
  );
};
