import React from "react";

import scaryMike from "assets/sfts/aoe/scary_mike.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const ScaryMike: React.FC = () => {
  return (
    <SFTDetailPopover name="Scary Mike">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={scaryMike}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          alt="Scary Mike"
        />
      </div>
    </SFTDetailPopover>
  );
};
