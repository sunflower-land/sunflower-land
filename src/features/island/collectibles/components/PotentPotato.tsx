import React from "react";

import potatoMutant from "assets/sfts/potato_mutant.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PotentPotato: React.FC = () => {
  return (
    <SFTDetailPopover name="Potent Potato">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={potatoMutant}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
          alt="Potent Potato"
        />
      </div>
    </SFTDetailPopover>
  );
};
