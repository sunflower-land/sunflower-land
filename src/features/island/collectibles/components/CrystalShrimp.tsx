import React from "react";

import crystalShrimpTrophy from "assets/fish/crystal_shrimp_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CrystalShrimp: React.FC = () => {
  return (
    <SFTDetailPopover name="Crystal Shrimp">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 35}px`,
          top: `${PIXEL_SCALE * -1}px`,
          right: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={crystalShrimpTrophy}
          style={{ width: `${PIXEL_SCALE * 35}px` }}
          className="absolute"
          alt="Crystal Shrimp"
        />
      </div>
    </SFTDetailPopover>
  );
};
