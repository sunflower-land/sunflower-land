import React from "react";

import skullCase from "assets/sfts/parasaur_skull_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ParasaurSkull: React.FC = () => {
  return (
    <SFTDetailPopover name="Parasaur Skull">
      <>
        <img
          src={skullCase}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Parasaur Skull"
        />
      </>
    </SFTDetailPopover>
  );
};
