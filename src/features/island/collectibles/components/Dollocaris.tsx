import React from "react";

import dollocarisTrophy from "assets/fish/dollocaris_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Dollocaris: React.FC = () => {
  return (
    <SFTDetailPopover name="Dollocaris">
      <>
        <img
          src={dollocarisTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Dollocaris"
        />
      </>
    </SFTDetailPopover>
  );
};
