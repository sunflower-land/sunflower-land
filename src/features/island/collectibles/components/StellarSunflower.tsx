import React from "react";

import sunflowerMutant from "assets/sfts/sunflower_mutant.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const StellarSunflower: React.FC = () => {
  return (
    <SFTDetailPopover name="Stellar Sunflower">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={sunflowerMutant}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
          alt="Stellar Sunflower"
        />
      </div>
    </SFTDetailPopover>
  );
};
