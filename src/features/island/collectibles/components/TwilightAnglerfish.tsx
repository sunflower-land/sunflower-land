import React from "react";

import trophy from "assets/fish/twilight_anglerfish_trophy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TwilightAnglerfish: React.FC = () => {
  return (
    <SFTDetailPopover name="Twilight Anglerfish">
      <>
        <img
          src={trophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Twilight Anglerfish"
        />
      </>
    </SFTDetailPopover>
  );
};
