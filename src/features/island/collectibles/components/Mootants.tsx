import React from "react";

import mootant from "assets/sfts/mootant.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Mootant: React.FC = () => {
  return (
    <SFTDetailPopover name="Mootant">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: `${PIXEL_SCALE * 25}px`,
        }}
      >
        <img src={mootant} className="w-full" alt="Mootant" />
      </div>
    </SFTDetailPopover>
  );
};
