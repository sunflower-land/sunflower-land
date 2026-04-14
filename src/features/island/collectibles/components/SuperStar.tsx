import React from "react";

import superStarTrophy from "assets/sfts/starfish_marvel_tank.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SuperStar: React.FC = () => {
  return (
    <SFTDetailPopover name="Super Star">
      <>
        <img
          src={superStarTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Super Star"
        />
      </>
    </SFTDetailPopover>
  );
};
