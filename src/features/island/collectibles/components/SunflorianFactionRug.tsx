import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import sunflorianFactionRug from "assets/factions/sunflorian_faction_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SunflorianFactionRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Sunflorian Faction Rug">
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
    </SFTDetailPopover>
  );
};
