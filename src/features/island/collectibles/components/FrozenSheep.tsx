import React from "react";

import frozenSheep from "assets/sfts/frozen_mutant_sheep.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const FrozenSheep: React.FC = () => {
  return (
    <SFTDetailPopover name="Frozen Sheep">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: `${PIXEL_SCALE * 27}px`,
        }}
      >
        <img src={frozenSheep} className="w-full" alt="Frozen Sheep" />
      </div>
    </SFTDetailPopover>
  );
};
