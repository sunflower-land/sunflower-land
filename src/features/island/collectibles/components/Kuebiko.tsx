import React from "react";

import kuebiko from "assets/nfts/kuebiko.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Kuebiko: React.FC = () => {
  return (
    <img
      src={kuebiko}
      style={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      alt="Kuebiko"
    />
  );
};
