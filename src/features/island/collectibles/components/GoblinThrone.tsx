import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/goblin_throne.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinThrone: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Throne">
      <div
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 21}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 transform -translate-x-1/2"
          alt="Goblin Throne"
        />
      </div>
    </SFTDetailPopover>
  );
};
