import React from "react";

import wendy from "assets/sfts/wood_nymph_wendy.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WoodNymphWendy: React.FC = () => {
  return (
    <SFTDetailPopover name="Wood Nymph Wendy">
      <img
        src={wendy}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Wood Nymph Wendy"
      />
    </SFTDetailPopover>
  );
};
