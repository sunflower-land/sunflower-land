import React from "react";

import trophy from "assets/fish/lemon_shark_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LemonShark: React.FC = () => {
  return (
    <SFTDetailPopover name="Lemon Shark">
      <img
        src={trophy}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Lemon Shark"
      />
    </SFTDetailPopover>
  );
};
