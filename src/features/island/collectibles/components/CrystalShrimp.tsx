import React from "react";

import crystalShrimpTrophy from "assets/fish/crystal_shrimp_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CrystalShrimp: React.FC = () => {
  return (
    <SFTDetailPopover name="Crystal Shrimp">
      <>
        <img
          src={crystalShrimpTrophy}
          style={{
            width: `${PIXEL_SCALE * 35}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Crystal Shrimp"
        />
      </>
    </SFTDetailPopover>
  );
};
