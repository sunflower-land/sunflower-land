import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/amethyst_nightshade_goblet.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AmethystNightshadeGoblet: React.FC = () => {
  return (
    <SFTDetailPopover name="Amethyst Nightshade Goblet">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Amethyst Nightshade Goblet"
      />
    </SFTDetailPopover>
  );
};
