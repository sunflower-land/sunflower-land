import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import sunflorianFactionRug from "assets/factions/sunflorian_faction_rug.webp";

export const SunflorianFactionRug: React.FC = () => {
  return (
    <>
      <img
        src={sunflorianFactionRug}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Sunflorian Faction Rug"
      />
    </>
  );
};
