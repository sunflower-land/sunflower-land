import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/bullseye_board.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BullseyeBoard: React.FC = () => {
  return (
    <SFTDetailPopover name="Bullseye Board">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="BullseyeBoard"
      />
    </SFTDetailPopover>
  );
};
