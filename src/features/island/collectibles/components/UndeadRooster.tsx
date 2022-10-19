import React from "react";

import undeadChicken from "assets/nfts/undead_chicken.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const UndeadRooster: React.FC = () => {
  return (
    <img
      src={undeadChicken}
      style={{
        width: `${PIXEL_SCALE * 29.82}px`,
      }}
      alt="Undead Rooster"
    />
  );
};
