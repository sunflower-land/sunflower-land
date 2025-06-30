import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import goblinFactionRug from "assets/factions/goblin_faction_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinFactionRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Faction Rug">
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
    </SFTDetailPopover>
  );
};
