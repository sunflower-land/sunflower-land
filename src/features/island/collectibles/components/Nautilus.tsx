import React from "react";

import nautilusTrophy from "assets/fish/nautilus_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Nautilus: React.FC = () => {
  return (
    <SFTDetailPopover name="Nautilus">
      <>
        <img
          src={nautilusTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Nautilus"
        />
      </>
    </SFTDetailPopover>
  );
};
