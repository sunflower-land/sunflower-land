import React from "react";

import mushroomHouse from "assets/seasons/dawn-breaker/mushroom_house.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MushroomHouse: React.FC = () => {
  return (
    <SFTDetailPopover name="Mushroom House">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 37}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={mushroomHouse}
          style={{
            width: `${PIXEL_SCALE * 37}px`,
          }}
          alt="Mushroom House"
        />
      </div>
    </SFTDetailPopover>
  );
};
