import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import goblinFactionRug from "src/assets/factions/goblin_faction_rug.webp";

export const GoblinFactionRug: React.FC = () => {
  return (
    <>
      <img
        src={goblinFactionRug}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Goblin Faction Rug"
      />
    </>
  );
};
