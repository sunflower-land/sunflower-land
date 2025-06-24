import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/goblin_right_wall_candle.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinRightWallSconce: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Right Wall Sconce">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        alt="Goblin Right Wall Sconce"
      />
    </SFTDetailPopover>
  );
};
