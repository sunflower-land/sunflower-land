import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/emerald_goblin_goblet.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const EmeraldGoblinGoblet: React.FC = () => {
  return (
    <SFTDetailPopover name="Emerald Goblin Goblet">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Emerald Goblin Goblet"
      />
    </SFTDetailPopover>
  );
};
