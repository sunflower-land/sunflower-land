import React from "react";

import rubberDucky from "assets/sfts/rubber_ducky.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RubberDucky: React.FC = () => {
  return (
    <SFTDetailPopover name="Rubber Ducky">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
      >
        <img
          src={rubberDucky}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Rubber Ducky"
        />
      </div>
    </SFTDetailPopover>
  );
};
