import React from "react";

import isopodTrophy from "assets/fish/isopod_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Isopod: React.FC = () => {
  return (
    <SFTDetailPopover name="Giant Isopod">
      <>
        <img
          src={isopodTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Giant Isopod"
        />
      </>
    </SFTDetailPopover>
  );
};
