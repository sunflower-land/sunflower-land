import React from "react";

import undeadChicken from "assets/animals/chickens/undead_chicken.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const UndeadRooster: React.FC = () => {
  return (
    <img
      src={undeadChicken}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Undead Rooster"
    />
  );
};
