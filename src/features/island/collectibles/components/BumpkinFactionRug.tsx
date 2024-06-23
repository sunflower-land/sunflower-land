import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import bumpkinFactionRug from "src/assets/factions/bumpkin_faction_rug.webp";

export const BumpkinFactionRug: React.FC = () => {
  return (
    <>
      <img
        src={bumpkinFactionRug}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Bumpkin Faction Rug"
      />
    </>
  );
};
