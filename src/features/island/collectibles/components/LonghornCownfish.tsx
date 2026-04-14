import React from "react";

import trophy from "assets/fish/cow_fish_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LonghornCowfish: React.FC = () => {
  return (
    <SFTDetailPopover name="Longhorn Cowfish">
      <>
        <img
          src={trophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Longhorn Cowfish"
        />
      </>
    </SFTDetailPopover>
  );
};
