import React from "react";

import trophy from "assets/fish/lemon_shark.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LemonShark: React.FC = () => {
  return (
    <SFTDetailPopover name="Lemon Shark">
      <>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            left: `${PIXEL_SCALE * 4}px`,
            bottom: `${PIXEL_SCALE * -1}px`,
          }}
          className="absolute"
        />
        <img
          src={trophy}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute"
          alt="Lemon Shark"
        />
      </>
    </SFTDetailPopover>
  );
};
