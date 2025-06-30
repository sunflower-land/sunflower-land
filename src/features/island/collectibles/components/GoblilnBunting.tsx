import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/goblin_victory_bunting.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinBunting: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Bunting">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Goblin Bunting"
      />
    </SFTDetailPopover>
  );
};
