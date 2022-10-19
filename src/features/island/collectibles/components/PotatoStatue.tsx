import React from "react";

import potatoStatue from "assets/nfts/potato_statue.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const PotatoStatue: React.FC = () => {
  return (
    <img
      src={potatoStatue}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Potato Statue"
    />
  );
};
