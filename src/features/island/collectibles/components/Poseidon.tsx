import React from "react";

import trophy from "assets/sfts/poseidon_fish_aquarium.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Poseidon: React.FC = () => {
  return (
    <SFTDetailPopover name="Poseidon">
      <img
        src={trophy}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Poseidon"
      />
    </SFTDetailPopover>
  );
};
