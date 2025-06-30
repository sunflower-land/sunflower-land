import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import rainbow from "assets/sfts/rainbow.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Rainbow: React.FC = () => {
  return (
    <SFTDetailPopover name="Rainbow">
      <div
        className="absolute flex justify-center w-full h-ful"
        style={{
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={rainbow}
          style={{
            width: `${PIXEL_SCALE * 36}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Rainbow"
        />
      </div>
    </SFTDetailPopover>
  );
};
