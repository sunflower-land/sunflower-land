import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import nightShadeFactionRug from "src/assets/factions/nightshade_faction_rug.webp";

export const NightshadeFactionRug: React.FC = () => {
  return (
    <>
      <img
        src={nightShadeFactionRug}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Nightshade Faction Rug"
      />
    </>
  );
};
