import React from "react";

import anchor from "assets/sfts/anchor.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Anchor: React.FC = () => {
  return (
    <SFTDetailPopover name="Anchor">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 27}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
      >
        <img
          src={anchor}
          style={{
            width: `${PIXEL_SCALE * 27}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Anchor"
        />
      </div>
    </SFTDetailPopover>
  );
};
