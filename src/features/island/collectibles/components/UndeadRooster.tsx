import React from "react";

import undeadChicken from "assets/animals/chickens/undead_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const UndeadRooster: React.FC = () => {
  return (
    <SFTDetailPopover name="Undead Rooster">
      <img
        src={undeadChicken}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Undead Rooster"
      />
    </SFTDetailPopover>
  );
};
