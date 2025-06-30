import React from "react";

import battleFish from "assets/fish/battle_fish.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BattleFish: React.FC = () => {
  return (
    <SFTDetailPopover name="Battle Fish">
      <>
        <img
          src={battleFish}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Battle Fish"
        />
      </>
    </SFTDetailPopover>
  );
};
