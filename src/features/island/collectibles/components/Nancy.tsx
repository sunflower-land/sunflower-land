import React from "react";

import nancy from "assets/sfts/nancy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const Nancy: React.FC = () => {
  return (
    <SFTDetailPopover name="Nancy">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={nancy}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
          }}
          alt="Nancy"
        />
      </div>
    </SFTDetailPopover>
  );
};
