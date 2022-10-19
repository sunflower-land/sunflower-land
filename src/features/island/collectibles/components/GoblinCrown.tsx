import React from "react";

import crown from "assets/nfts/chicken_coop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const GoblinCrown: React.FC = () => {
  return (
    <img
      src={crown}
      style={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      alt="GoblinCrown"
    />
  );
};
