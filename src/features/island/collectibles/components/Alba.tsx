import React from "react";

import walrus from "assets/sfts/alba.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Alba: React.FC = () => {
  return (
    <SFTDetailPopover name="Alba">
      <>
        <img
          src={walrus}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Alba"
        />
      </>
    </SFTDetailPopover>
  );
};
