import React from "react";

import crown from "assets/sfts/goblin_crown.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinCrown: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Crown">
      <img
        src={crown}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 5}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        className="absolute"
        alt="Goblin Crown"
      />
    </SFTDetailPopover>
  );
};
